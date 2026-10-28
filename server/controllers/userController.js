const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

async function signUp(req, res) {
  const { name, email, password, c_password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ msg: "All fields are required", status: "false" });
  }
  if (c_password && password !== c_password) {
    return res.status(400).json({ msg: "Password must match Confirm Password", status: "false" });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ msg: "Password must be at least 8 characters", status: "false" });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await userModel.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(400).json({ msg: "Email already registered", status: "false" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await userModel.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password: hashedPassword,
    phone: String(phone).trim(),
    userType: "Ordinary",
  });

  return res.status(201).json({ msg: "User registered successfully", status: "true" });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Required fields", status: "false" });
  }

  const user = await userModel.findOne({ email: String(email).trim().toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ msg: "Invalid email or password", status: "false" });
  }

  const token = jwt.sign(
    { id: user._id, userType: user.userType, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d", algorithm: "HS256" }
  );

  return res.status(200).json({
    msg: "Login successful",
    status: "true",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
    },
  });
}

async function getAllUsers(req, res) {
  const users = await userModel.find().select("-password").sort({ createdAt: -1 });
  return res.status(200).json(users);
}

module.exports = { signUp, login, getAllUsers };
