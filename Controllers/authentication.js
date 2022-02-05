const fs = require("fs");
const messageModel = require("../Models/message");
const userModel = require("../Models/user");
const { confirmationEmail } = require("../utils/utils.js");
const plugin = require("../utils/confirmation_mail_templates/confirmation_mail_plugin");

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
    await messageModel.create({
      user_id: user._id,
      code: confirmation_Token,
      sent_date: new Date(),
      expiresIn: new Date(new Date().getTime() + 15 * 60 * 1000), // expires after 15 minutes
      request_type: "register",
    });
    res.status(201).json({
      message: `Congrats ${user.name} your account is created.`,
      email: user.email,
      name: user.name,
      token,
    });
  } catch (error) {
    throw error;
  }
};

const confirmMail = async (req, res) => {
  let message = await messageModel.findOne({ user_id: req.user._id }).sort({sent_date: -1});
  if (!message) {
    return res.status(400).json({ error: "User not registres" });
  }
  const { token } = req.body;
  if (!token || message.code !== token) {
    return res.status(400).json({ error: "Invalid token" });
  }
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
  res.status(202).json({
    message: `${user.name} logged in`,
    user: { name: user.name },
    token,
  });
};

const changePWDRequest = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Please provide a user email" });
  }
  let user = await userModel.findOne({ email });
  const token = user.jwtSignUser();
  const confirmation_Token = user.confirmationEmailToken();
  let bitmap = fs.readFileSync("./assets/images/coursier.png");
  let logo = bitmap.toString("base64");
  try {
    const html = plugin.template(logo, confirmation_Token);
    await confirmationEmail(user.email, html);
    await messageModel.create({
      user_id: user._id,
      code: confirmation_Token,
      sent_date: new Date(),
      expiresIn: new Date(new Date().getTime() + 15 * 60 * 1000), // expires after 15 minutes
      request_type: "resetPWD",
    });
    console.log(
      "An confirmation token is sent to your inbox, Please check you email"
    );
    res
      .status(200)
      .json({
        message:
          "An confirmation token is sent to your inbox, Please check your email",
        token,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const isConfirmationTokenValid = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res
      .status(400)
      .json({
        error: "Pleae provide a confirmation token received in your email",
      });
  }
  const message = await messageModel.findOne({
    code: token,
    request_type: "resetPWD"
  }).sort({sent_date: -1});
  if (!message || message.expiresIn < new Date()) {
    return res.status(400).json({ error: "Invalid token" });
  }
  res.status(200).json({ message: "Valid token" });
};

const resetPWD = async (req, res) => {
  console.log("/resetPWD");
  const { newPassword } = req.body;
  if (!newPassword) {
    return res
      .status(400)
      .json({ error: "You have to provide a new password" });
  };
  let user = req.user;
  user.password = newPassword;
  await user.save();
  res.status(200).json({message: "The Password is updated"})
  console.log("/resetPWD");
};
module.exports = {
  register,
  confirmMail,
  login,
  changePWDRequest,
  isConfirmationTokenValid,
  resetPWD,
};
