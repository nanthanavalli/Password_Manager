const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  passwordList: [
    {
      email: { type: String },
      password: {
        iv: { type: String, required: true },
        data: { type: String, required: true },
        tag: { type: String, required: true },
      },
      name: { type: String },
      username: { type: String },
      url: { type: String },
      type: { type: String },
      note: { type: String },
    },
  ],
});

const User = mongoose.model("User", schema);

module.exports = User;
