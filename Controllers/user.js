require("dotenv").config();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const userModel = require("../Models/users");

const emailConfirmation = async (email, htmlOutput) => {
  try {
      // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.USER,
        pass: process.env.SECRET,
      },
      tls: {
        rejectUnauthorized: false
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.USER, // sender address
      to: email, // list of receivers
      subject: "Mail Confirmation", // Subject line
      html: htmlOutput, // html body
    });
    console.log(`mail sended ${info.messageId}`);
  } catch (error) {
    console.log(error);
  };
};

const register = async (req, res) => {
  let newUser = req.body;
  if (!newUser || !newUser.email || !newUser.password) {
    return res.status(404).json({ error: "Please provide a user data" });
  };
  const salt = 10;
  newUser.password = await bcrypt.hash(newUser.password, salt);
  const user = await userModel.create(newUser);
  const token = jwt.sign({id: user._id, name: user.name}, process.env.JWT_SECRET, { expiresIn: '1h'});
  // const htmlOutput = `<div>
  //                       <h1> Hello </h1>
  //                       <p>
  //                         Thanks for your registration in our plateforme.
  //                         Please click on that link to confirm your email address
  //                       </p>
  //                       <a href=`${req.host}/api/v1/users/confirm_email?token=${token}`>Confirmation Link</a>
  //                     </div>`;

  // await emailConfirmation(newUser.email, htmlOutput);

  res
    .status(200)
    .json({ message: `Congrats ${user.name} your account is created.`, token });
};

const confirmMail = (req, res) => {
  // let user = userModel.findOne({});
  res.send('<h1>Great ! Your mail is now confirmed you can log in </h1>');
};

const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(401).json({ error: "invalid  email/password pattern" });
  }
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ error: "User Not Found" });
  };
  const isValidPWD = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPWD) {
    return res.status(401).json({ error: "Invalid password" });
  };
  res.status(200).json({ message: "login Success" });
};

const userHome = (req, res) => {
  res.status(200).json({user: req.user});
};

module.exports = { userHome, register, confirmMail, login };
