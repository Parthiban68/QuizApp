const express = require("express");
const apiService = express.Router();
const userService = require("../Controllers/Services");
const path = require("path");

apiService.get("/", (req, res) => {
  res.status(200).json({ message: "route" });
});

apiService.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await userService.signup(username, email, password);
    res
      .status(200)
      .json({ message: "activation link send successfully", user });
  } catch (error) {
    res.status(400).json({ message: "user already exists", error });
  }
});

apiService.get(`/activate/:activationCode`, async (req, res) => {
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
    res.status(400).json({ message: "can't able to activate the mail", error });
  }
});

apiService.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userLogin = await userService.signin(email, password);
    res.status(200).json({ message: "Login Successfull", userLogin });
  } catch (error) {
    res
      .status(400)
      .json({ message: "can't able to login to your account", error });
  }
});

apiService.post("/forgetpassword", async (req, res) => {
  const {email} = req.body;

  try {
    const data = await userService.forgetPassword(email);
    res.status(200).json({ message: "Mail send successfully", data });
  } catch (error) {
    res.status(400).json({ message: "can't able to send mail", error });
  }
});

module.exports = apiService;
