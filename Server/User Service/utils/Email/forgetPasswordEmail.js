const path = require('path');
const fs = require('fs');
const nodemailer = require("nodemailer");

const forgetPasswordMail = (email) => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.email_id,
      pass: process.env.email_password,
    },
  });

  const templatePath = path.join(__dirname, '..', 'Templates', 'forgetPasswordTemplate.html');
  const htmlContent = fs.readFileSync(templatePath,'Utf8');

  const mailOption = {
    from: process.env.email_id,
    to: email,
    subject: "Password Reset",
    html:htmlContent
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log(err);
        reject(new Error("cannot send the forget password link"));
      } else {
        resolve("Forget password link send to your email");
      }
    });
  });
};

module.exports = forgetPasswordMail;
