const { v4: uuidv4 } = require("uuid");
const userRepositry = require("../Database/Repository");
const forge = require("node-forge");
const activationMail = require("../utils/emailService");

exports.signup = async (username, email, password) => {
  const userExits = await userRepositry.findByEmail(email);

  console.log(userExits);

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

  const data = await userRepositry.createUser(
    username,
    email,
    encryptPassword,
    ivHex,
    activationCode
  );

  const activationLink = `http://localhost:${process.env.api}/user/account/activate/${activationCode}`;

  await activationMail(username, email, activationLink);

  return data;
};
