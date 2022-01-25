const express = require('express');
const app = express();
const cors = require('cors');
const db = require('../db/conn');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;



app.get('/', (req, res) => {
  res.json({ message: 'Hello from server!' });
});


  mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
