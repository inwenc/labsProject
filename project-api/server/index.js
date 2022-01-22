const express = require('express')
const app = express()
const port = process.env.PORT || 3001

app.get('/', (req, res) => {
  res.json({ message: "Hello from server!" });
})

app.listen(port, () => {
  console.log(`labs app listening on port ${port}`)
})