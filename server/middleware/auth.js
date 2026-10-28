const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ msg: "Access denied. Please log in.", status: "false" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired session.", status: "false" });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.userType !== "Admin") {
    return res.status(403).json({ msg: "Admin access required.", status: "false" });
  }
  next();
}

module.exports = { auth, adminOnly };
