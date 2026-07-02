const express = require("express");
const PORT = 7777;
const app = express();

//Request Handlers
// app.use("/test", (req, res) => {
//   res.send("It is listening on the /test route");
// });

app.get("/user", (req, res) => {
  res.send({ firstName: "Ashutosh", lastName: "Kumar" });
});

app.post("/user", (req, res) => {
  res.send("Data sent succesfully to the server");
});

app.delete("/user", (req, res) => {
  res.send("user deleted successfully. Bye!");
});

app.get("/abc/:userId/:age/:name", (req, res) => {
  console.log(req.query);
  console.log(req.params);
  res.send("Working..." + JSON.stringify(req.params));
});
// app.use("/hello", (req, res) => {
//   res.send("It is listening on the /hello route");
// });
// app.use("/", (req, res) => {
//   res.send("Hello, thoda padh liya kar MC");
// });

app.use(
  "/route",
  (req, res, next) => {
    next();
    // res.send("Route1");
  },
  (req, res, next) => {
    next();
    res.send("Route2");
  },
);

//Listener
app.listen(PORT, () => {
  console.log(`Server is listening on the PORT: ${PORT}`);
});
