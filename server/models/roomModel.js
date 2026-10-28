const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: Number, required: true, unique: true },
    count: { type: Number, required: true, default: 1 },
    rent: { type: Number, required: true },
    type: { type: String, required: true },
    photos: { type: [String], default: [] },
    description: { type: String, required: true },
    amenities: { type: [String], default: [] },
    currentbookings: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("rooms", roomSchema);
