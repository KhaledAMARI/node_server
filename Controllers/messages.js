const messageModel = require("../Models/message");
const userModel = require("../Models/user");

const createMessage = async (req, res) => {
  const { code, delay } = req.body;
  const { email } = await userModel.findById({ _id: req.user._id});
  if (!code || !delay) {
    return res.status(422).json({ error: "Please provide a message params" });
  }
  newMessage.expiresIn = new Date(
    new Date().getTime() + delay * 60 * 1000
  );
  newMessage.sent_date = new Date();
  let message = await messageModel.create(newMessage);
  message.delay = delay;
  res.status(201).json({ msg: "Message créer", message });
};

const getMessage = async (req, res) => {
  const message = await messageModel.find({ user_id: req.user._id }).sort("createdAt");
  if (!message) {
    return res.status(404).json({ error: "Message Not Found" });
  }
  res.status(200).json({ message });
};

module.exports = { getMessage, createMessage };
