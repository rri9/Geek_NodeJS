const nodemailer = require("nodemailer");

const smtpTransp = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: "rri9.test@mail.ru",
    pass: "passwd"
  }
});

const mailOptions = {
  from: "rri9.test@mail.ru",
  to: "rri9@mail.ru",
  subject: "Test nodemailer",
  text: "Hello, World ✔",
  // html: "Hello <b>World!</b> ✔",
};

smtpTransp.sendMail(mailOptions, (err, response) => {
  if (err) {
    console.log("Error sending:", err);
  } else {
    console.log(response);
  }
});

smtpTransp.close();