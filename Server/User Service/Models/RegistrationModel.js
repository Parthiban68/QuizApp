const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  iv: { type: String, require: true, default: null },
  secertkey: { type: String, require: true, default: null },
  activationCode: { type: String, require: true, default: null },
  isActivate: { type: Boolean, require: true, default: false },
  passwordResetToken:{type:String,require:true,default: null},
  passwordResetTokenExpries:{type:Date,require:true,default: null}
});

const userModel = mongoose.model("userDetails", userSchema);

module.exports = userModel;
