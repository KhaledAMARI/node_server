const messageModel = require("../Models/messages");

const createMessage = async (req, res) => {
  const newMessage = req.body;
  if (!newMessage || !newMessage.email || !newMessage.code || !newMessage.delay) {
    return res.status(422).json({ error: "Please provide a message params" });
  }
  newMessage.expiresIn = new Date((new Date()).getTime() + (newMessage.delay * 60 * 1000));
  newMessage.sent_date = new Date();
  let message = await messageModel.create(newMessage);
  message.delay = newMessage.delay;
  res.status(201).json({msg: "Message créer", message});
};

const getMessage = async (req, res) => {
  const { email } = req.body;
  const message = await messageModel.findOne({ email });
  if (!message) {
    return res.status(404).json({ error: "Message Not Found" });
  }
  res.status(200).json({ message });
};

module.exports = { getMessage, createMessage };
