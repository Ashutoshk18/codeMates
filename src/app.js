const express = require("express");
const PORT = 7777;
const app = express();

//Request Handlers
// app.use("/test", (req, res) => {
//   res.send("It is listening on the /test route");
// });

//Listener
app.listen(PORT, () => {
  console.log(`Server is listening on the PORT: ${PORT}`);
});
