const express = require("express");
const router = express.Router();
const { adminAuth, userAuth } = require("../middlewares/auth");
const { validateUpdateData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateUpdateData(req);

    const requestedUpdates = Object.keys(req.body);
    const loggedInUser = req.user;

    requestedUpdates.forEach((field) => {
      loggedInUser[field] = req.body[field];
    });

    await loggedInUser.save();

    res
      .status(200)
      .json({ message: "User data edited successfully", data: loggedInUser });
  } catch (err) {
    res.status(500).send("Something went wrong: " + err.message);
  }
});

router.patch("/profile/reset-password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new password are required" });
    }

    const loggedInUser = await User.findById(req.user._id).select("+password");
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      loggedInUser.password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is invalid" });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      loggedInUser.password,
    );
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters, with lowercase, uppercase, numbers and symbol",
      });
    }

    loggedInUser.password = newPassword; //"pre" would be called later, if we'd use .save()
    await loggedInUser.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ "ERROR: ": err.message });
  }
});

module.exports = router;
