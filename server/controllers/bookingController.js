const bookingModel = require("../models/bookingModel");
const roomModel = require("../models/roomModel");
const userModel = require("../models/userModel");
const { datesOverlap, isDate, nightsBetween } = require("../utils/dateUtils");

async function bookRoom(req, res) {
  const { roomid, fromdate, todate } = req.body;

  if (!roomid || !fromdate || !todate) {
    return res.status(400).json({ msg: "Room and booking dates are required", status: "false" });
  }
  if (!isDate(fromdate) || !isDate(todate)) {
    return res.status(400).json({ msg: "Dates must use YYYY-MM-DD format", status: "false" });
  }

  const days = nightsBetween(fromdate, todate);
  if (days < 1) return res.status(400).json({ msg: "Check-out must be after check-in", status: "false" });

  const session = await roomModel.startSession();
  let booking;
  try {
    await session.withTransaction(async () => {
      const room = await roomModel.findById(roomid).session(session);
      if (!room) {
        const error = new Error("Room not found");
        error.statusCode = 404;
        throw error;
      }

      const user = await userModel.findById(req.user.id).session(session);
      const overlapping = (room.currentbookings || []).filter(
        (item) => item.status !== "cancelled"
          && datesOverlap(fromdate, todate, item.fromdate, item.todate)
      );
      if (overlapping.length >= (room.count || 1)) {
        const error = new Error("Room is not available for the selected dates");
        error.statusCode = 400;
        throw error;
      }

      [booking] = await bookingModel.create([{
        roomid: room._id,
        type: room.type,
        userid: req.user.id,
        username: req.user.name,
        fromdate,
        todate,
        totalAmount: days * room.rent,
        totaldays: days,
        phone: user?.phone || "",
        status: "booked",
      }], { session });

      room.currentbookings.push({
        bookingid: booking._id,
        userid: req.user.id,
        fromdate,
        todate,
        status: "booked",
      });
      await room.save({ session });
    });
  } finally {
    await session.endSession();
  }

  return res.status(201).json({ msg: "Room booked successfully", booking, status: "true" });
}

async function cancelBooking(req, res) {
  const { bookingid } = req.body;
  const booking = await bookingModel.findById(bookingid);
  if (!booking) return res.status(404).json({ msg: "Booking not found", status: "false" });

  const isOwner = String(booking.userid) === String(req.user.id);
  if (!isOwner && req.user.userType !== "Admin") {
    return res.status(403).json({ msg: "Not allowed", status: "false" });
  }
  if (booking.status === "cancelled") {
    return res.status(400).json({ msg: "Booking already cancelled", status: "false" });
  }

  booking.status = "cancelled";
  await booking.save();
  await roomModel.updateOne(
    { _id: booking.roomid, "currentbookings.bookingid": booking._id },
    { $set: { "currentbookings.$.status": "cancelled" } }
  );
  return res.status(200).json({ msg: "Booking cancelled", status: "true" });
}

async function getUserBookings(req, res) {
  const bookings = await bookingModel.find({ userid: req.user.id })
    .populate("roomid")
    .sort({ createdAt: -1 });
  return res.status(200).json(bookings);
}

async function getAllBookings(req, res) {
  const bookings = await bookingModel.find()
    .populate("roomid userid")
    .sort({ createdAt: -1 });
  return res.status(200).json(bookings);
}

module.exports = { bookRoom, cancelBooking, getUserBookings, getAllBookings };
