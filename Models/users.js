const mongoose = require('mongoose');
const mongooseSchema = mongoose.Schema;

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

const UserSchema = new mongooseSchema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    default: ''
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    match:  [/.+\@.+\..+/, "Please fill a valid email address."]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password']
  },
  isConfirmed: {
    type: Boolean,
    default: false
  }
}, schemaOptions);

const userModel = mongoose.model('Users', UserSchema);

module.exports = userModel;

