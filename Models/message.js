const mongoose = require('mongoose');

const mongooseSchema = mongoose.Schema;

const messageSchemaOptions = {
  timestumps: true,
  toJSON: {
    virtuals: true
  }
}

const messageSchema = new mongooseSchema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  code: String,
  sent_date: Date,
  expiresIn: Date,
  request_type: String
}, messageSchemaOptions);

const messageModel = mongoose.model('Message', messageSchema);

module.exports = messageModel;