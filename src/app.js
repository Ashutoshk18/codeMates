const express = require("express");
const PORT = 7777;
const app = express();

//Request Handlers
app.use("/test", (req, res) => {
  res.send("It is listening on the /test route");
});

app.use("/hello", (req, res) => {
  res.send("It is listening on the /hello route");
});
app.use("/", (req, res) => {
  res.send("Hello, thoda padh liya kar MC");
});

//Listener
app.listen(PORT, () => {
  console.log(`Server is listening on the PORT: ${PORT}`);
});
