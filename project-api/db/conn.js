var mongoose = require("mongoose");

//Set up default mongoose connection
var mongoDB = "mongodb://mongo/my_database";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var Schema = mongoose.Schema;

var runningCheckpointsSchema = new Schema({
  checkpoints: [String],
});

var Checkpoints = mongoose.model("Checkpoints", runningCheckpointsSchema);

console.log(mongoose.connection.readyState, "hello");
module.exports = {
  Checkpoints,
};
