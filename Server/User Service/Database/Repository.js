const userModel = require("../Models/RegistrationModel");


exports.findByEmail = async (email) => {
  const userData = await userModel.findOne({email});
  return userData;
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


exports.findActivationCode = async (activationCode) =>{
  const activationExists = await userModel.findOne({activationCode});
  return activationExists;
}

exports.activateId = async(exists) =>{
    exists.isActivate = true;
   return await exists.save()
}

exports.findEmail = async (email) => {
  const userData = await userModel.findOne({email});
  return userData;
};


exports.forgetPassword = async (email) =>{
    return await userModel.findOne({email})
}