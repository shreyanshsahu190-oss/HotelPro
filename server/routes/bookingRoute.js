const express = require("express");
const { auth, adminOnly } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const {
  bookRoom, cancelBooking, getUserBookings, getAllBookings,
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/bookroom", auth, asyncHandler(bookRoom));
router.post("/cancelbooking", auth, asyncHandler(cancelBooking));
router.get("/getuserbookings", auth, asyncHandler(getUserBookings));
router.get("/getallbookings", auth, adminOnly, asyncHandler(getAllBookings));

module.exports = router;
