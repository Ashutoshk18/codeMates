const express = require("express");
const app = express();
const PORT = 7777;
const { adminAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const User = require("./models/user");

//Middlewares
app.use(express.json());
// app.use(express.json());
app.use("/admin", adminAuth);

app.use("/admin/getAllData", (req, res, next) => {
  res.send("Le re lund ke tere users ka data");
});

app.use("/admin/deleteUser", (req, res, next) => {
  res.send("Deleted a user");
});

app.post("/signup", async (req, res, next) => {
  const userData = req.body;

  // const userData = {
  //   firstName: "Ashutosh",
  //   lastName: "Kumar",
  //   age: 21,
  //   gender: "male",
  // };
  const user = new User(userData);
  try {
    await user.save();
    res.send("User is added to the DB");
  } catch (err) {
    res.status(400).send("User is not added to the DB:" + err.message);
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
app.patch("/user", async (req, res) => {
  const { userId, ...data } = req.body;

  try {
    console.log(userId);
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User upadated successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong");
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
