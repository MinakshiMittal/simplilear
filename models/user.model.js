const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: "Email can't be blank!",
    match: /\S+@\S+\.\S+/
  },
  password: {
    type: String,
    required: "Enter password",
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };