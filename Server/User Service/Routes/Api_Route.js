const express = require("express");
const apiService = express.Router();
const userService = require("../Controllers/Services");
const path = require("path");
const auth = require('../utils/Authtenication/jwt_Authentication')

apiService.get("/", (req, res) => {
  res.status(200).json({ message: "route" });
});

apiService.post("/signup", async (req, res,next) => {
  const { username, email, password } = req.body;

  try {
    const user = await userService.signup(username, email, password);
    res
      .status(200)
      .json({ message: "activation link send successfully", user });
  } catch (error) {
    next(error);
  }
});

apiService.get(`/activate/:activationCode`, async (req, res,next) => {
  const { activationCode } = req.params;

  try {
    const activateMail = await userService.activate(activationCode);
    const templatePath = path.join(
      __dirname,
      "..",
      "utils",
      "Templates",
      "greetingTemplate.html"
    );
    res.sendFile(templatePath);
  } catch (error) {
    next(error);
  }
});

apiService.post("/signin", async (req, res,next) => {
  const { email, password } = req.body;
  try {
    const userLogin = await userService.signin(email, password);
    res.status(200).json({ message: "Login Successfull", userLogin });
  } catch (error) {
    next(error);
  }
});

apiService.patch("/forgetpassword", async (req, res,next) => {
  const {email} = req.body;

  try {
    const data = await userService.forgetPassword(email);
    res.status(200).json({ message: "Mail send successfully", data });
  } catch (error) {
    next(error);
  }
});

apiService.patch(`/resetpassword`, async (req, res,next) =>{

  const {token, newPassword} = req.body
  try {
   const data = await userService.resetPassword(token, newPassword);
   res.status(200).json({message: "Password updated Succeessfully please login", data})
    
  } catch (error) {
    next(error);
  }
})

apiService.patch('/changepassword',auth.authMiddelware,async (req,res,next)=>{
  const {email, password} = req.body;
  try {
    const data = await userService.changepassword(email, password);
    res.status(200).json({message:"Changed password succesfully", data})
  } catch (error) {
    next(error);
  }
});




module.exports = apiService;
