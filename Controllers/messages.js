const messageModel = require("../Models/message");
const userModel = require("../Models/user");

const createMessage = async (req, res) => {
  let newMessage = req.body;
  if (!newMessage.code || !newMessage.delay) {
    return res.status(422).json({ error: "Please provide a message params" });
  }
  newMessage.expiresIn = new Date(
    new Date().getTime() + newMessage.delay * 60 * 1000
  );
  newMessage.sent_date = new Date();
  newMessage.user_id = req.user._id;
  let message = await messageModel.create(newMessage);
  message.delay = newMessage.delay;
  res.status(201).json({ msg: "Message créer", message });
};

const getMessage = async (req, res) => {
  const message = await messageModel.findOne({ user_id: req.user._id }); //.sort("sent_date")
  if (!message) {
    return res.status(404).json({ error: "Message Not Found" });
  }
  res.status(200).json({ message });
};

module.exports = { getMessage, createMessage };
