const express = require("express");
const app = express();
const cors = require("cors");
const { db, Checkpoints } = require("../db/conn");
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

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
