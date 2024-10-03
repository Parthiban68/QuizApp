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
  activationCode
) => {
  const user = new userModel({
    username,
    email,
    password,
    iv,
    activationCode,
  });
  return await user.save();
};


