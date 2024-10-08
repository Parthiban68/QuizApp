const nodemailer = require("nodemailer");

const emailService = (email, htmlContent, subject) => {
 
  
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.email_id,
      pass: process.env.email_password,
    },
  });

  const mailOption = {
    from: "QuizApp <noreply@quizapp.com>",
    to: email,
    subject: subject,
    html: htmlContent,
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(mailOption, (err, info) => {
      if (err) {
        reject(new Error("can't can't able to send Mail", err));
      } else {
        resolve(
          "Mail Send to the user Successfully"
        );
      }
    });
  });
};

module.exports = emailService;
