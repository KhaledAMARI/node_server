const mongoose = require('mongoose');

const mongooseSchema = mongoose.Schema;

const messageSchemaOptions = {
  timestumps: true,
  toJSON: {
    virtuals: true
  }
}

const messageSchema = new mongooseSchema({
  email: String,
  code: String,
  sent_date: Date,
  expiresIn: Date
}, messageSchemaOptions);

const messageModel = mongoose.model('Message', messageSchema);

module.exports = messageModel;