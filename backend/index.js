const express = require("express");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
const app = express();
const AuthRoute = require("./routes/auth_route");
const HomeRoute = require("./routes/home_route");
const checkAuth = require("./middleware/checkAuth");
const cors = require("cors");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", AuthRoute);
app.use("/home", checkAuth, HomeRoute);
app.use("/test", (req, res, next) => {
  res.send("Hello from server");
});

mongoose.connection.once("open", () => {
  app.listen(8080, () => {
    console.log("Server started at: https:localhost:8080");
  });
  // console.log("Mongo Success");
});

// module.exports = app;
