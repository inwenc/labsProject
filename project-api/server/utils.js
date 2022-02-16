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
