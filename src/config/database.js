const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ashutosh:ashutosh@cluster0.ugvtraf.mongodb.net/codeMates?appName=Cluster0",
  );
};

module.exports = connectDB;
