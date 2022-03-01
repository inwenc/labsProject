const path = require("path");
const fs = require("fs").promises;

/*
 * Calculates time between checkpoint to checkpoint
 * @params {string, string, Array}
 * @returns {}
 */
function calculateTimes(start, end, listOfResults) {
  //create date format
  let hr;
  let min;
  let sec;
  //create date format
  let timeStart = new Date(start).getTime();
  let timeEnd = new Date(end).getTime();

  let hourDiff = timeEnd - timeStart;

  let secInTotal = hourDiff / 1000;
  let minInTotal = Math.round(secInTotal / 60);
  if (minInTotal > 60) {
    hr = Math.round(minInTotal / 60);
    min = minInTotal % 60;
    sec = secInTotal % 60;
  } else {
    hr = 0;
    min = Math.round(secInTotal / 60);
    sec = min % 60;
  }
  listOfResults.push(`${hr}hr ${min}min ${sec}sec`); // 0hr 5min 3sec
}
/*
 * @param {Array of Strings} listOfTimes
 * @returns {Array}: array containing string of time ['0hr 6min 3sec', '7min 10sec, 6min, 2sec]
 */

function getMetrics(listOfTimes) {
  console.log("listOfTimes", listOfTimes);
  const listOfResults = [];
  for (let i = 1; i < listOfTimes.length; i++) {
    calculateTimes(listOfTimes[i - 1], listOfTimes[i], listOfResults);
  }
  // Calculate total time from press of start button to stop
  calculateTimes(
    listOfTimes[0],
    listOfTimes[listOfTimes.length - 1],
    listOfResults
  );

  return listOfResults; // eg. ['0hr 6min 3sec', '7min 10sec, 6min, 2sec]
}
/*
 * Truncates gps coordinates to the 4th decimal eg. 3.98945938 => 3.9894
 * With 4 decimals the gps accuracy is approx by 110m
 * @param {string, number}
 * @returns {string} eg. 3.98945938 => 3.9894
 */
function toFixedTrunc(x, n) {
  const v = (typeof x === "string" ? x : x.toString()).split(".");
  if (n <= 0) return v[0];
  let f = v[1] || "";
  if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
  while (f.length < n) f += "0";
  return `${v[0]}.${f}`;
}
/*
 * Format checkpoints from last saved to mongo
 * params checkpointsList
 * @params {Array of Objects}  eg. [{"_id":"61f1eec4bc96c814e5a3066d","checkpoints":["{\n \"lat\": 9.930298172088937,\n \"lng\": -84.09498617000581\n}","{\n \"lat\": 9.929452723032597,\n \"lng\": -84.09189626522065\n}"],"__v":0},{"_id":"62084c5f7cdb3299709e88f8","checkpoints":["{\n \"lat\": 9.929630234490215,\n \"lng\": -84.08906921691896\n}","{\n \"lat\": 9.929666368630901,\n \"lng\": -84.08791780471802\n}","{\n \"lat\": 9.928066148827014,\n \"lng\": -84.08857569046022\n}","{\n \"lat\": 9.926480919245485,\n \"lng\": -84.08915504760743\n}"],"__v":0},{"_id":"62084f94a44e9be8b66122a5","checkpoints":["{\n \"lat\": 9.929630234490215,\n \"lng\": -84.08906921691896\n}","{\n \"lat\": 9.929666368630901,\n \"lng\": -84.08791780471802\n}","{\n \"lat\": 9.928066148827014,\n \"lng\": -84.08857569046022\n}","{\n \"lat\": 9.926480919245485,\n \"lng\": -84.08915504760743\n}"],"__v":0},{"_id":"6208518217ff4dbec687db1d","checkpoints":[null,null,null,null],"__v":0},{"_id":"620851cbc774ca45b1920dfe","checkpoints":[null,null],"__v":0},{"_id":"62085237d3c6eb302a942aa0","checkpoints":[null,null],"__v":0},{"_id":"620852e27d15b26ef5173e94","checkpoints":["{\n \"lat\": 9.928706595913564,\n \"lng\": -84.09088239021303\n}","{\n \"lat\": 9.92837898307031,\n \"lng\": -84.09000262565614\n}"],"__v":0}]
 * @returns {Array of Objects}
 * eg.
 * [
 *  { lat: '9.9302', lng: '-84.0949' },
 *  { lat: '9.9294', lng: '-84.0918' }
 * ]
 */

function formatCheckpoints(checkpointsList) {
  let results = [];

  checkpointsList[checkpointsList.length - 1].checkpoints.forEach((coord) =>
    results.push(JSON.parse(coord.replace(/\n/g, "")))
  );

  results.forEach((obj) => {
    obj["lat"] = toFixedTrunc(Number(obj["lat"]), 4);
    obj["lng"] = toFixedTrunc(Number(obj["lng"]), 5);
  });

  return results;
}
/*
 * Helper func used in compareCheckpointsAndDataFromGPS method
 * @param {Array of Objects, Array of Objects, number, Array}
 * eg. listOfDataFromGPS =  [
 *  { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' },
 *  { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 02:50:59' },
 *  { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' },
 *  { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' },
 *  { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' },
 *  { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' }
 * ]
 * eg. checkpoints = [
 * { lat: '9.9334', lng: '-84.1334' },
 *  { lat: '9.9334', lng: '-84.1334' }
 * ]
 */

function getListOfTimes(
  listOfDataFromGPS,
  checkpoints,
  idxFromCheckpointList,
  listOfTimes
) {
  if (idxFromCheckpointList > checkpoints.length) {
    return;
  }
  listOfDataFromGPS.forEach((eachSet) => {
    if (
      eachSet["lat"] === checkpoints[idxFromCheckpointList]["lat"] &&
      eachSet["lon"] === checkpoints[idxFromCheckpointList]["lng"]
    ) {
      listOfTimes.push(eachSet["time"]);
      idxFromCheckpointList += 1;
    }
  });
}
/*
 * @param {Array of objects, Array of objects}
 * @returns Array of strings, timestamps eg. ['2022-02-10 01:47:59', '2022-02-10 01:47:59']
 */
function compareCheckpointsAndDataFromGPS(listOfDataFromGPS, checkpoints) {
  const listOfTimes = [];
  let checkpointIndex = 0;
  // always add the start time from first row
  listOfTimes.push(listOfDataFromGPS[0]["time"]);
  // always add the stop time
  listOfTimes.push(listOfDataFromGPS[listOfDataFromGPS.length - 1]["time"]);
  getListOfTimes(listOfDataFromGPS, checkpoints, checkpointIndex, listOfTimes);
  return listOfTimes;
}
/*
 * Formats text from gps text file
 * @param {String } eg. 9.9334811, -84.1334356, 2022-02-10 01:47:59
 * 9.9334811, -84.1334356, 2022-02-10 01:50:04
 * @returns {Array of Objects }
 * eg. [
 *       { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' },
 *       { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' },
 *       { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' },
 *       { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' },
 *       { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' },
 *       { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' }
 *     ]
 */

function formatListOfDataFromGPS(listOfDataFromGPS) {
  const results = [];
  const arrFormat = listOfDataFromGPS.split("\n");
  arrFormat.forEach((unit) => {
    let lineArr = unit.split(", ");
    let formatObject = {
      lat: toFixedTrunc(lineArr[0], 4),
      lon: toFixedTrunc(lineArr[1], 5),
      time: lineArr[2],
    };
    results.push(formatObject);
  });
  return results;
}
/*
 * Reads data from gps text file
 * @param {}
 * @returns {string}
 */

async function loadGpsCoordinates() {
  const data = await fs.readFile(path.resolve(__dirname, "gps.txt"), "utf8");
  return data;
}

module.exports = {
  loadGpsCoordinates,
  formatCheckpoints,
  formatListOfDataFromGPS,
  compareCheckpointsAndDataFromGPS,
  getMetrics,
};
