const express = require("express");
const app = express();
const PORT = 7777;
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
//Middlewares
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/", authRouter);
app.use("/", profileRouter);

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
