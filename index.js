const express = require('express')
const app = express()
const port = 3000
const controller = require('./controllers/index.js')
const server = require('./routes/user.js')
const database = require('./config/dbConfig.js')


database.authenticate()
  .then(() => {
    console.log('Berhasil terhubung database');
  })
  .catch(err => {
    console.error(`Gagal terhubung : ${err}`);
  });

app.use(express.json())

app.use(server)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})