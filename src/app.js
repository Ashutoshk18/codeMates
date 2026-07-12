const express = require("express");
const app = express();
const PORT = 7777;
const { adminAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const User = require("./models/user");
const {
  validateSignupData,
  validateUpdateData,
} = require("./utils/validation");
//Middlewares
app.use(express.json());
// app.use(express.json());
app.use("/admin", adminAuth);

app.use("/admin/getAllData", (req, res, next) => {
  res.send("Users data is given");
});

app.use("/admin/deleteUser", (req, res, next) => {
  res.send("Deleted a user");
});

app.post("/signup", async (req, res, next) => {
  // const userData = {
  //   firstName: "Ashutosh",
  //   lastName: "Kumar",
  //   age: 21,
  //   gender: "male",
  // };
  try {
    validateSignupData(req);

    const { firstName, lastName, email, password } = req.body;

    const user = new User({ firstName, lastName, email, password }); //Creating a new user instance according to the "User" model.
    await user.save();
    res.send("User is added to the DB");
  } catch (err) {
    res.status(400).send("Signup failed: " + err.message);
  }
});

//GET user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    console.log(userEmail);
    const user = await User.find({ email: userEmail });
    if (user.length === 0) {
      res.status(404).send("User doesn't exists!");
    } else res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//FEED Api
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});

    if (!allUsers) {
      res.send("There are no users");
    } else {
      res.send(allUsers);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

//Update User
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;

  try {
    validateUpdateData(req);

    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    console.log(user);
    res.send("User upadated successfully!");
  } catch (err) {
    res.status(400).send("Update failed: " + err.message);
  }
});

//Delete User
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // const result = await User.findByIdAndDelete({ _id: userId });
    const result = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

//Listener
connectDB()
  .then(() => {
    console.log("Connection to Database is successfull");
    app.listen(PORT, () => {
      console.log(`Server is listening on the PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
