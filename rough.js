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
