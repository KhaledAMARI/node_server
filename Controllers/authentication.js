const fs = require("fs");

const userModel = require("../Models/user");
const { confirmationEmail } = require("../utils/utils.js");

const register = async (req, res) => {
  let newUser = req.body;
  if (!newUser || !newUser.email || !newUser.password) {
    return res.status(400).json({ error: "Please provide a user data" });
  }
  const user = await userModel.create(newUser);
  const confirmation_Token = user.confirmationEmailToken();
  const token = user.jwtSignUser();
  const plugin = require("../utils/confirmation_mail_templates/confirmation_mail_plugin");
  let bitmap = fs.readFileSync("./assets/images/coursier.png");
  let logo = bitmap.toString("base64");
  try {
    const html = plugin.template(logo, confirmation_Token);
    await confirmationEmail(newUser.email, html);
    res.status(201).json({
      message: `Congrats ${user.name} your account is created.`,
      confirmation_Token,
      email: user.email,
      name: user.name,
      token,
    });
  } catch (error) {
    throw error;
  }
};

const confirmMail = async (req, res) => {
  await userModel.updateOne({ _id: req.user._id }, { isConfirmed: true });
  res.status(200).json({
    message: `Great ! Your mail is now confirmed you can log in ${req.user.name}`,
  });
};

const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(401).json({ error: "invalid  email/password pattern" });
  }
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ error: "User Not Found" });
  }
  const isValidPWD = await user.isValidPassword(req.body.password);
  if (!isValidPWD) {
    return res.status(401).json({ error: "Invalid password" });
  }
  if (!user.isConfirmed) {
    return res.status(401).json({ error: "Please confirm your mail address!" });
  }
  const token = user.jwtSignUser();
  res
  .status(202)
  .json({
    message: `${user.name} logged in`,
    user: { name: user.name },
    token
  });
};

module.exports = { register, confirmMail, login };
