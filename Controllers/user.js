const bcrypt = require("bcrypt");
const fs = require('fs');

const userModel = require("../Models/users");
const { jwtSignUser, confirmationEmail, confirmationEmailToken } = require("../utils/utils.js");

const register = async (req, res) => {
  let newUser = req.body;
  if (!newUser || !newUser.email || !newUser.password) {
    return res.status(400).json({ error: "Please provide a user data" });
  };
  const SALT_FACTOR = 10;
  newUser.password = await bcrypt
    .genSalt(SALT_FACTOR)
    .then((salt, err) =>
      err ? console.log(err) : bcrypt.hash(newUser.password, salt)
    );
  const user = await userModel.create(newUser);
  const confirmation_Token = confirmationEmailToken();
  const plugin = require("../utils/confirmation_mail_templates/confirmation_mail_plugin");
  let bitmap = fs.readFileSync('./assets/images/coursier.png');
  let logo = bitmap.toString('base64');
  const html = plugin.template(logo, confirmation_Token);
  await confirmationEmail(newUser.email, html);
  res
    .status(200)
    .json({
      message: `Congrats ${user.name} your account is created.`,
      registerToken,
    });
};

const confirmMail = (req, res) => {
  // let user = userModel.findOne({});
  res.send("<h1>Great ! Your mail is now confirmed you can log in </h1>");
};

const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(401).json({ error: "invalid  email/password pattern" });
  }
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ error: "User Not Found" });
  }
  const isValidPWD = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPWD) {
    return res.status(401).json({ error: "Invalid password" });
  }
  const loginToken = await jwtSignUser(user._id, user.name);
  res.status(200).json({ message: `${user.name}logged in`, loginToken });
};

const userHome = (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = { userHome, register, confirmMail, login };
