const path = require("path");
const fs = require("fs").promises;
/*




let json =
 "{\n \"lat\": 9.930298172088937,\n \"lng\":-84.09498617000581\n}"


    let regex = '/Dog/i'
     json.replace(/\n/g, '')
// console.log(json)
let arr = [
    {
        "_id": "61f1eec4bc96c814e5a3066d",
        "checkpoints": [
            "{\n \"lat\": 9.930298172088937,\n \"lng\": -84.09498617000581\n}",
            "{\n \"lat\": 9.929452723032597,\n \"lng\": -84.09189626522065\n}"
        ],
        "__v": 0
    }
]
let results = []
arr.forEach(obj => obj.checkpoints.forEach(coord =>  
results.push(JSON.parse(coord.replace(/\n/g, '')))))

results.forEach(obj => {
  obj['lat'] = Number(obj['lat'].toFixed(4))
  obj['lng'] = Number(obj['lng'].toFixed(4))
})

// arr.forEach(obj => obj.checkpoints.forEach(coord =>  
// JSON.parse(coord.replace(/\n/g, ''))
// // obj.lat = obj.lat.toFixed(4)
// // obj.lng = obj.lng.toFixed(4)
// results.push(obj
// )))
// console.log('results', results)

//results.forEach
//console.log(JSON.parse(arr[0].checkpoint))

// const generateData = (arrOfCheckpoints, arrOfCoord = []) => {


// }

    function calculateTime() {

            let results = ''
             //create date format          
             let timeStart = new Date("2022-02-10 01:47:59").getTime();
             let timeEnd = new Date("2022-02-10 01:55:30").getTime();
             
             let hourDiff = timeEnd - timeStart;    
            
            let secInTotal = hourDiff/1000
            let min = Math.round(secInTotal/60)
            const sec = secInTotal % 60 
            console.log(min, sec)
             
    }
    calculateTime()

    function getListOfTime (listOfDataFromGPS, checkpoints, idxFromCheckpointList) {
      const listOfTime = [];
      listOfDataFromGPS.forEach((eachSet, i) => {
        if (eachSet['lan'] === checkpoints[idxFromCheckpointList].lan && eachSet['lon'] === checkpoints[idxFromCheckpointList].lng && indexFromChepointList <= checkPointsList.length) {
            listOfTime.push(eachSet['time']);
            indexFromCheckPointList += 1;
        } else {
          break;
        }
      });
      return listOfTime;
    }



*/
// ['2022-02-10 01:47:59', '2022-02-10 01:47:59']
function calculateTimes(start, end, listOfResults) {
  //create date format
  let timeStart = new Date(start).getTime();
  let timeEnd = new Date(end).getTime();

  let hourDiff = timeEnd - timeStart;

  let secInTotal = hourDiff / 1000;
  let min = Math.round(secInTotal / 60);
  const sec = secInTotal % 60;
  listOfResults.push(`${min} ${sec}`);
}
// calculates metrics between checkpoint to checkpoint
function getMetrics(listOfTimes) {
  console.log("listOfTime", listOfTimes);
  const listOfResults = [];
  for (let i = 1; i < listOfTimes.length; i++) {
    calculateTimes(listOfTimes[i - 1], listOfTimes[i], listOfResults);
  }
  return listOfResults; // ['63 0']
}
function toFixedTrunc(x, n) {
  const v = (typeof x === "string" ? x : x.toString()).split(".");
  if (n <= 0) return v[0];
  let f = v[1] || "";
  if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
  while (f.length < n) f += "0";
  return `${v[0]}.${f}`;
}

function formatCheckpoints(checkpointsList) {
  let results = [];

  checkpointsList[0].checkpoints.forEach((coord) =>
    results.push(JSON.parse(coord.replace(/\n/g, "")))
  );

  results.forEach((obj) => {
    obj["lat"] = toFixedTrunc(Number(obj["lat"]), 4);
    obj["lng"] = toFixedTrunc(Number(obj["lng"]), 4);
  });

  return results;
  /*
[
  { lat: '9.9302', lng: '-84.0949' },
  { lat: '9.9294', lng: '-84.0918' }
]
  */
}

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

function compareCheckpointsAndDataFromGPS(listOfDataFromGPS, checkpoints) {
  const listOfTimes = [];
  let checkpointIndex = 0;
  // always add the start time
  listOfTimes.push(listOfDataFromGPS[0]["time"]);
  getListOfTimes(listOfDataFromGPS, checkpoints, checkpointIndex, listOfTimes);
  console.log("list", listOfTimes);
  return listOfTimes;
}

function formatListOfDataFromGPS(listOfDataFromGPS) {
  const results = [];
  const arrFormat = listOfDataFromGPS.split("\n");
  arrFormat.forEach((unit) => {
    let lineArr = unit.split(", ");
    let formatObject = {
      lat: toFixedTrunc(lineArr[0], 4),
      lon: toFixedTrunc(lineArr[1], 4),
      time: lineArr[2],
    };
    results.push(formatObject);
  });
  return results;
  /*
[
  { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' },
  { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' },
  { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' },
  { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' },
  { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' },
  { lat: '9.9334', lon: '-84.1334', time: '2022-02-10 01:47:59' }
]

  */
}

async function loadGpsCoordinates() {
  const data = await fs.readFile(path.resolve(__dirname, "gps.txt"), "utf8");
  return data;
}

module.exports = {
  loadGpsCoordinates,
  formatCheckpoints,
  formatListOfDataFromGPS,
  compareCheckpointsAndDataFromGPS,
};
