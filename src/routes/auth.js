const express = require("express");
const router = express.Router();
const {
  validateSignupData,
  validateUpdateData,
  validateLoginData,
} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res, next) => {
  // const userData = {
  //   firstName: "Ashutosh",
  //   lastName: "Kumar",
  //   age: 21,
  //   gender: "male",
  // };
  try {
    //Validation
    validateSignupData(req);

    const { firstName, lastName, email, password } = req.body;
    //Password Encryption
    const user = new User({
      firstName,
      lastName,
      email,
      password,
    }); //Creating a new user instance according to the "User" model.
    await user.save();
    res.json({ message: "User is added to the DB" });
  } catch (err) {
    res.status(400).send("Signup failed: " + err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    validateLoginData(req);
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      // const token = await jwt.sign({ _id: user._id }, "ashutosh@secretKey", {
      //   expiresIn: "15m",
      // });
      const accessToken = await user.getAccessToken();
      const refreshToken = await user.getRefreshToken();

      user.refreshToken = refreshToken;
      await user.save();

      const baseCookieOpts = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      };

      res
        .cookie("accessToken", accessToken, {
          ...baseCookieOpts,
          maxAge: 15 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
          ...baseCookieOpts,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .send("Login Successful!");

      //   const token = await user.getJWT();
      //   res.cookie("token", token, {
      //     httpOnly: true,
      //     secure: true,
      //     sameSite: "strict",
      //     maxAge: 7 * 24 * 60 * 60 * 1000,
      //   });
      //   res.send("Login successful");
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).send("No refresh token provided");
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).send("Invalid or expired refresh token");
    }

    const user = await User.findById(decoded._id).select("+refreshToken");
    if (!user || user.refreshToken != refreshToken) {
      return res.status(401).send("Refresh token invalid");
    }

    const newAccessToken = await user.getAccessToken();
    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: "true",
        maxAge: 15 * 60 * 1000,
      })
      .send("Access token refreshed");
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        { $unset: { refreshToken: 1 } },
      );
    }

    const opts = { httpOnly: true, secure: true, sameSite: "strict" };
    res
      .clearCookie("accessToken", opts)
      .clearCookie("refreshToken", opts)
      .send("Logout Successful!");
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
