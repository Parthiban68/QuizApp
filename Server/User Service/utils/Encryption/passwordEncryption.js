const forge = require("node-forge");

exports.encryptedPassword = (userPassword) => {
  const cipher = forge.cipher.createCipher("AES-CBC", userPassword.secretKey);
  cipher.start({ iv: userPassword.iv });
  cipher.update(forge.util.createBuffer(userPassword.password));
  cipher.finish();
  const encryptPassword = forge.util.bytesToHex(cipher.output.getBytes());
  return encryptPassword;
};

exports.comparePassword = (compare) => {
  const secretkey = forge.util.hexToBytes(compare.storedSecretkey);
  const iv = forge.util.hexToBytes(compare.storedIv);
  const cipher = forge.cipher.createCipher("AES-CBC", secretkey);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(compare.userPassword));
  cipher.finish();
  const userEncryptPassword = forge.util.bytesToHex(cipher.output.getBytes());
  return userEncryptPassword === compare.storedPassword;
};
