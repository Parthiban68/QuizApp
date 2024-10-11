const { v4: uuidv4 } = require("uuid");
const userRepositry = require("../Database/Repository");
const forge = require("node-forge");
const emailService = require("../utils/Email/emailService");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const encryption = require("../utils/Encryption/passwordEncryption");

exports.signup = async (username, email, password) => {
  const userExits = await userRepositry.findByEmail(email);

  if (userExits) {
    const error = new error("user not exists");
    throw error;
  }

  const activationCode = uuidv4();

  const secretkey = forge.random.getBytesSync(32);
  const iv = forge.random.getBytesSync(16);
  const encryptPassword = encryption.encryptedPassword({
    secretKey: secretkey,
    iv: iv,
    password: password,
  });
  const ivHex = forge.util.bytesToHex(iv);
  const newSecretKey = forge.util.bytesToHex(secretkey);

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

  const data = await userRepositry.createUser(
    username,
    email,
    encryptPassword,
    ivHex,
    newSecretKey,
    activationCode
  );

  return data;
};

exports.activate = async (activationCode) => {
  const exists = await userRepositry.findActivationCode(activationCode);

  if (!exists) {
    const error = new error("user not exists");
    throw error;
  }

  const data = await userRepositry.activateId(exists);
  return data;
};

exports.signin = async (email, password) => {
  const userDetails = await userRepositry.findByEmail(email);
  if (!userDetails) {
    console.log("user Not found");
    const error = new error("user Not found");
    throw error;
  }

  const isMatching = encryption.comparePassword({
    storedSecretkey: userDetails.secertkey,
    storedIv: userDetails.iv,
    userPassword: password,
    storedPassword: userDetails.password,
  });

  if (!isMatching) {
    console.log("password not match");
    const errors = new error("password not match");
    throw errors;
  }

  if (!userDetails.isActivate) {
    console.log("Not Activated");
    const error = new error("Not Activated");
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
  let userEmail = await userRepositry.findByEmail(email);
  if (!userEmail) {
    console.log("user Not found");
    const error = new error("user Not found");
    throw error;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

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

  const token = `http://localhost:${process.env.api}/user/account/resetpassword/${resetToken}`;

  const templatePath = path.join(
    __dirname,
    "..",
    "utils",
    "Templates",
    "forgetPasswordTemplate.html"
  );
  let htmlContent = fs.readFileSync(templatePath, "Utf8");
  htmlContent = htmlContent.replace("{{token}}", token);
  const subject = "Password Reset";

  return await emailService(email, htmlContent, subject);
};

exports.resetPassword = async (token, newPassword) => {
  const newtoken = crypto.createHash("sha256").update(token).digest("hex");

  let user = await userRepositry.findToken(newtoken);

  if (!user) {
    console.log("user Not found");
    const error = new error("Token is invalid or expries", 400);
    throw error;
  }
  const secretkey = forge.util.hexToBytes(user.secertkey);
  const iv = forge.util.hexToBytes(user.iv);
  const encrypteNewPassword = encryption.encryptedPassword({
    secretKey: secretkey,
    iv: iv,
    password: newPassword,
  });
  const data = await userRepositry.savePassword(user, encrypteNewPassword);
  return data;
};
