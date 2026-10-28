const roomModel = require("../models/roomModel");
const { datesOverlap, isDate } = require("../utils/dateUtils");

async function getAllRooms(req, res) {
  const rooms = await roomModel.find().sort({ roomNumber: 1 });
  const { fromdate, todate } = req.query;

  if ((fromdate && !todate) || (!fromdate && todate)
    || (fromdate && (!isDate(fromdate) || !isDate(todate)))) {
    return res.status(400).json({ msg: "Valid arrival and departure dates are required", status: "false" });
  }
  if (fromdate && todate && fromdate >= todate) {
    return res.status(400).json({ msg: "Departure must be after arrival", status: "false" });
  }
  if (!fromdate || !todate) return res.status(200).json(rooms);

  const available = rooms.filter((room) => {
    const active = (room.currentbookings || []).filter((booking) => booking.status !== "cancelled");
    const overlapping = active.filter((booking) =>
      datesOverlap(fromdate, todate, booking.fromdate, booking.todate)
    ).length;
    return overlapping < (room.count || 1);
  });
  return res.status(200).json(available);
}

async function getRoom(req, res) {
  const room = await roomModel.findById(req.params.id);
  if (!room) return res.status(404).json({ msg: "Room not found", status: "false" });
  return res.status(200).json(room);
}

async function addRoom(req, res) {
  const room = await roomModel.create({
    roomNumber: Number(req.body.roomNumber),
    count: Number(req.body.count),
    rent: Number(req.body.rent),
    type: String(req.body.type || "").trim(),
    photos: Array.isArray(req.body.photos) ? req.body.photos : [],
    description: String(req.body.description || "").trim(),
    amenities: Array.isArray(req.body.amenities) ? req.body.amenities : [],
  });
  return res.status(201).json(room);
}

async function updateRoom(req, res) {
  const room = await roomModel.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!room) return res.status(404).json({ msg: "Room not found", status: "false" });
  return res.status(200).json(room);
}

async function deleteRoom(req, res) {
  const room = await roomModel.findByIdAndDelete(req.params.id);
  if (!room) return res.status(404).json({ msg: "Room not found", status: "false" });
  return res.status(200).json({ msg: "Room deleted", status: "true" });
}

module.exports = { getAllRooms, getRoom, addRoom, updateRoom, deleteRoom };
