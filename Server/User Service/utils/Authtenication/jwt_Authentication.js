const jwt = require("jsonwebtoken");
const customError = require("../Error/customError");
const util = require("util");
const userRepositry = require("../../Database/Repository");


exports.authMiddelware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    next(new customError("Your are not logged in", 401));
  }

  const decode = new util.promisify(jwt.verify)(token, process.env.secert_str);

  const user = userRepositry.findUserId(decode._id);

  if (!user) {
    next(new customError("The user with the given token does not exist", 401));
  }

  next();
};
