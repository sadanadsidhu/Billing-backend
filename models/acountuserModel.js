const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String },
  phoneNumber: { type: Number },
  password:{ type: String },
});

const UserModel = mongoose.model("AcountUser", userSchema);

module.exports = UserModel;