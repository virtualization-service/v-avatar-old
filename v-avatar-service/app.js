const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const trainingRoutes = require("./routes/training");
const userRoutes = require("./routes/user");

var app = express();

mongoose.connect(
  "mongodb://localhost:27017/v-avatar?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false"
);

mongoose.connection.on("error", (err) => {
  if (err) {
    console.log("Error occured");
  }
});

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo DB");
});

const port = 3000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use("/api/trainings", trainingRoutes);
app.use("/api/user", userRoutes);

app.listen(port, () => {
  console.log("Server started at port: " + port);
});
