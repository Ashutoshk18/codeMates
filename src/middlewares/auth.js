const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyz";

  if (!isAuthorized) {
    res.status(401).send("Unauthorized User");
  } else {
    next();
  }
};

const userAuth = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return res.status(401).send("ERROR: No access token provided");
    }

    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      return res.status(401).send("ERROR: Invalid or expired access token");
    }

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).send("ERROR: User not found, login again!");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
