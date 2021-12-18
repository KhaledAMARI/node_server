const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const mongooseSchema = mongoose.Schema;

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
};

const UserSchema = new mongooseSchema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      default: "",
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
      // match:  [/.+\@.+\..+/, "Please fill a valid email address."]
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please fill a valid email address.",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions
);

UserSchema.pre('save', async function() {
  const SALT_FACTOR = 10;
  const salt = await bcrypt.genSalt(SALT_FACTOR)
  this.password = await bcrypt.hash(this.password, salt);
});

const userModel = mongoose.model("Users", UserSchema);

module.exports = userModel;
