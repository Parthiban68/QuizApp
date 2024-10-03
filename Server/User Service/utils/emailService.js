const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');


const activationMail = (username, email, activationLink) => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.email_id,
      pass: process.env.email_password,
    },
  });
  
  // const hbsOption = {
  //   viewEngine:{
  //     extName:'.hbs',
  //     partialsDir:path.resolve('../utils/Templates'),
  //     defaultLayout:false
  //   },
  //   extName:'.hbs',
  //   viewPath:path.resolve('../utils/Templates'),
  // }

  // transport.use('compile', hbs(hbsOption));

  const templatePath = path.join(__dirname,'Templates','Verificationmail.html');
  let htmlContent = fs.readFileSync(templatePath, 'Utf8')

  htmlContent=htmlContent.replace('{{activationLink}}', activationLink);

  const mailoption = {
    from: process.env.email_id,
    to: email,
    subject: "Activation Mail",
    // template: 'verificationTemplate',
    // context:{
    //   username:username,
    //   activationLink:activationLink,
    // }
    html: htmlContent
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(mailoption, (err, info) => {
      if (err) {
        console.log(err);
        reject(new Error("cannot send the link activation link"));
      } else {
        resolve(
          "Activation link send to your email please verify to proceed login"
        );
      }
    });
  });
};

module.exports = activationMail;
