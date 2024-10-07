const { v4: uuidv4 } = require("uuid");
const userRepositry = require("../Database/Repository");
const forge = require("node-forge");
const emailService = require("../utils/Email/emailService");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

exports.signup = async (username, email, password) => {
  const userExits = await userRepositry.findByEmail(email);

  if (userExits) {
    const error = new error.message();
    throw error;
  }

  const activationCode = uuidv4();

  const secretkey = forge.random.getBytesSync(32);
  const iv = forge.random.getBytesSync(16);

  const encryptedPassword = () => {
    const cipher = forge.cipher.createCipher("AES-CBC", secretkey);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(password));
    cipher.finish();
    const encrypted = cipher.output.getBytes();
    return forge.util.bytesToHex(encrypted);
  };

  const encryptPassword = encryptedPassword();
  const ivHex = forge.util.bytesToHex(iv);
  const newSecretKey = forge.util.bytesToHex(secretkey);

  const data = await userRepositry.createUser(
    username,
    email,
    encryptPassword,
    ivHex,
    newSecretKey,
    activationCode
  );

  const activationLink = `http://localhost:${process.env.api}/user/account/activate/${activationCode}`;

  const templatePath = path.join(
    __dirname,
    "..",
    "utils",
    "Templates",
    "Verificationmail.html"
  );
  let htmlContent = fs.readFileSync(templatePath, "Utf8");

  htmlContent = htmlContent.replace("{{activationLink}}", activationLink);

  const subject = "Confirm your email address";

  await emailService(email, htmlContent, subject);

  return data;
};

exports.activate = async (activationCode) => {
  const exists = await userRepositry.findActivationCode(activationCode);

  if (!exists) {
    const error = new error.message();
    throw error;
  }

  const data = await userRepositry.activateId(exists);
  return data;
};

exports.signin = async (email, password) => {
  const userDetails = await userRepositry.findEmail(email);

  if (!userDetails) {
    console.log("user Not found");
    const error = new error.message("user Not found");
    throw error;
  }

  const comparePassword = (encryptedStoredPassword, iv, storedSecertkey) => {
    const secretkey = forge.util.hexToBytes(storedSecertkey);
    const cipher = forge.cipher.createCipher("AES-CBC", secretkey);
    cipher.start({ iv: forge.util.hexToBytes(iv) });
    cipher.update(forge.util.createBuffer(password));
    cipher.finish();
    const encryptedUserPassword = forge.util.bytesToHex(
      cipher.output.getBytes()
    );
    return encryptedUserPassword === encryptedStoredPassword;
  };

  const isMatching = comparePassword(
    userDetails.password,
    userDetails.iv,
    userDetails.secertkey
  );

  if (!isMatching) {
    console.log("password not match");
    const errors = new error.message("password not match");
    throw errors;
  }

  if (!userDetails.isActivate) {
    console.log("Not Activated");
    const error = error.message("Not Activated");
    throw error;
  }

  const token = jwt.sign({ _id: userDetails._id }, "secretkey123", {
    expiresIn: "15d",
  });

  return {
    token: token,
    username: userDetails.username,
    email: userDetails.email,
  };
};

exports.forgetPassword = async (email) => {
  let userEmail = await userRepositry.forgetPassword(email);

  if (!userEmail) {
    console.log("user Not found");
    const error = new error.message("user Not found");
    throw error;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  console.log(resetToken);

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const passwordResetTokenExpries = Date.now() + 10 * 60 * 1000;

  const storeToken = await userRepositry.saveResetToken(
    userEmail,
    passwordResetToken,
    passwordResetTokenExpries
  );

  const templatePath = path.join(
    __dirname,
    "..",
    "utils",
    "Templates",
    "forgetPasswordTemplate.html"
  );
  const htmlContent = fs.readFileSync(templatePath, "Utf8");

  const subject = "Password Reset";

  return await emailService(email, htmlContent, subject);
};
