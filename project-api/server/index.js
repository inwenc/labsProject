const express = require('express');
const app = express();
const cors = require('cors');
const db = require('../db/conn');
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.json({ message: 'Hello from server!' });
});


  // start the Express server
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });

