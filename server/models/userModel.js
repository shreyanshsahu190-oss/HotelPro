const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true },
    password: { type: String, required: [true, "Password is required"] },
    phone: { type: String, required: [true, "Phone is required"] },
    userType: { type: String, required: [true, "User type is required"], enum: ["Admin", "Ordinary"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
