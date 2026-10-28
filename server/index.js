const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const userRoute = require("./routes/userRoute");
const roomRoute = require("./routes/roomRoute");
const bookingRoute = require("./routes/bookingRoute");
const userModel = require("./models/userModel");
const roomModel = require("./models/roomModel");
const seedRooms = require("./seed/rooms");
const bcrypt = require("bcryptjs");

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = Number(process.env.PORT) || 8001;
const JWT_SECRET = process.env.JWT_SECRET || "";
const app = express();

if (JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long.");
}

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
}));
app.use(express.json({ limit: "100kb" }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
}));

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log("Connected to MongoDB");
  } catch (error) {
    if (NODE_ENV === "production" || process.env.ALLOW_IN_MEMORY_DB !== "true") {
      throw error;
    }
    console.warn("MongoDB unavailable; using the explicitly enabled in-memory database for development.");
    const { MongoMemoryReplSet } = require("mongodb-memory-server");
    const mem = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    await mongoose.connect(mem.getUri());
    console.log("Connected to in-memory MongoDB");
  }
  if (process.env.SEED_DEMO_DATA === "true") {
    await seedIfEmpty();
  }
}

async function seedIfEmpty() {
  const userCount = await userModel.countDocuments();
  if (userCount === 0) {
    const password = await bcrypt.hash("Admin@123", 10);
    const guestPass = await bcrypt.hash("Guest@123", 10);
    await userModel.create([
      {
        name: "Hotel Admin",
        email: "admin@hotelpro.com",
        password,
        phone: "9990001111",
        userType: "Admin",
      },
      {
        name: "Aarav Mehta",
        email: "guest@hotelpro.com",
        password: guestPass,
        phone: "9876543210",
        userType: "Ordinary",
      },
    ]);
    console.log("Seeded admin and guest users");
  }

  const roomCount = await roomModel.countDocuments();
  if (roomCount === 0) {
    await roomModel.insertMany(seedRooms);
    console.log("Seeded rooms");
  }
}

app.use("/user", userRoute);
app.use("/rooms", roomRoute);
app.use("/bookings", bookingRoute);

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "HotelPro API" });
});

app.use((req, res) => {
  res.status(404).json({ msg: "Route not found", status: "false" });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  res.status(500).json({ msg: "Internal server error", status: "false" });
});

async function start() {
  await connectDb();
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received; shutting down.`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((error) => {
  console.error("Unable to start server:", error);
  process.exit(1);
});
