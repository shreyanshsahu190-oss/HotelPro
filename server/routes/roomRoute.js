const express = require("express");
const { auth, adminOnly } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const {
  getAllRooms, getRoom, addRoom, updateRoom, deleteRoom,
} = require("../controllers/roomController");

const router = express.Router();

router.get("/getallrooms", asyncHandler(getAllRooms));
router.get("/getroom/:id", asyncHandler(getRoom));
router.post("/addroom", auth, adminOnly, asyncHandler(addRoom));
router.put("/updateroom/:id", auth, adminOnly, asyncHandler(updateRoom));
router.delete("/deleteroom/:id", auth, adminOnly, asyncHandler(deleteRoom));

module.exports = router;
