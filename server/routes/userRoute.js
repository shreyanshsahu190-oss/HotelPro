const express = require("express");
const { auth, adminOnly } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const { signUp, login, getAllUsers } = require("../controllers/userController");

const router = express.Router();

router.post("/SignUp", asyncHandler(signUp));
router.post("/Login", asyncHandler(login));
router.get("/getallusers", auth, adminOnly, asyncHandler(getAllUsers));

module.exports = router;
