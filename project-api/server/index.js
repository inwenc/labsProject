const express = require("express");
const app = express();
const cors = require("cors");
const { db, Checkpoints } = require("../db/conn");
const {
  loadGpsCoordinates,
  formatCheckpoints,
  formatListOfDataFromGPS,
  compareCheckpointsAndDataFromGPS,
  getMetrics,
} = require("./utils");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/postCheckpoints", async (req, res) => {
  let dataSet = req.body;

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

  const results = await Checkpoints.find({});

  const formatFromText = formatListOfDataFromGPS(data);

  const formattedCheckpoints = formatCheckpoints(results);
  const listOfTimes = compareCheckpointsAndDataFromGPS(
    formatFromText,
    formattedCheckpoints
  );
  const metrics = getMetrics(listOfTimes);

  const sampleResponse = ["0hr 6min 3sec", "0hr 7min 10sec", "0hr 6min 2sec"];
  res.json(sampleResponse);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
