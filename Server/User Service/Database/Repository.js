const userModel = require("../Models/RegistrationModel");

exports.findByEmail = async (email) => {
  return await userModel.find({ email });
};

exports.createUser = async (
  username,
  email,
  password,
  iv,
  secertkey,
  activationCode
) => {
  const user = new userModel({
    username,
    email,
    password,
    iv,
    secertkey,
    activationCode,
  });
  return await user.save();
};

exports.findActivationCode = async (activationCode) => {
  const activationExists = await userModel.findOne({ activationCode });
  return activationExists;
};

exports.activateId = async (exists) => {
  exists.isActivate = true;
  return await exists.save();
};

exports.saveResetToken = async (
  user,
  passwordResetToken,
  passwordResetTokenExpries
) => {
  user.passwordResetToken = passwordResetToken;
  user.passwordResetTokenExpries = passwordResetTokenExpries;

  return await user.save();
};

exports.findToken = async (token) => {
  return await userModel.findOne({
    passwordResetToken: token,
    passwordResetTokenExpries: { $gt: Date.now() },
  });
};

exports.savePassword = async (user, newPassword) => {
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpries = undefined;

  return await user.save();
};


exports.changePassword = async(userExits,password) =>{
  userExits.password = password;
  return await userExits.save();
}

exports.findUserId = async(id) =>{
return await userModel.findById(id);
}