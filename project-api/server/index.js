const express = require('express');
const app = express();
const cors = require('cors');
const db = require('../db/conn');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.post('/postCheckpoints', (req, res) => {
  let dataSet = req.body
  console.log('dataSet', dataSet)
  // insertDataSet(dataSet, (err, results)=>{
  //   if (err) {
  //     console.log('err', err);
  //   } else {
  //     var stringifyResults = JSON.stringify(results);
  //     res.end(stringifyResults);
  //   }
  // })
  res.json('received')

})


  mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
