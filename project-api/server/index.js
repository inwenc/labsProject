const express = require("express");
const app = express();
const cors = require("cors");
const { db, Checkpoints } = require("../db/conn");
const { loadGpsCoordinates } = require("./utils");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;
const bodyParser = require("body-parser");
// const { readFile } = require("fs").promises;
// const path = require("path");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/postCheckpoints", async (req, res) => {
  let dataSet = req.body;

  console.log("dataSet", dataSet);
  const checkpoints = new Checkpoints({
    checkpoints: dataSet,
  });
  await checkpoints.save(function (err) {
    if (err) return handleError(err);
    console.log("saved!");
  });

  res.json("received");
});

app.get("/getCheckpoints", async (req, res) => {
  const data = await loadGpsCoordinates();
  console.log("data", data);
  const results = await Checkpoints.find({});
  res.json(results);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
