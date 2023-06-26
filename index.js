const dotenv = require('dotenv'); 
dotenv.config();
const express = require('express')
const app = express()

const port = process.env.PORT;
const server = require('./routes/user.js')
const database = require('./config/dbConfig.js')
const cookieParser = require("cookie-parser");
const methodOverride = require('method-override');
const auth = require('./routes/user.js')
const fileUpload = require('express-fileupload');
const uploadRoute = require('./routes/user.js');
const session = require('express-session');

app.use(session({
  secret: 'amin',
  resave: false,
  saveUninitialized: false
}));
app.use(fileUpload());
app.use('/upSignature', uploadRoute);
app.use('/upresources', uploadRoute);

app.use(methodOverride('_method'));
app.use(cookieParser());
app.use('/auth', auth);

database.authenticate()
  .then(() => {
    console.log('Berhasil terhubung database');
  })
  .catch(err => {
    console.error(`Gagal terhubung : ${err}`);
  });


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs');
app.use('/views', express.static(__dirname + '/views'));
app.use(server)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})