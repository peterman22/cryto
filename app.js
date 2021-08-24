var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./src/helpers/dbConnect');
require('./src/helpers/_error').guard();
const cors = require('cors');
const requestIP = require('request-ip');
const CronController = require('./src/controllers/CronController');
const cronController = new CronController();

cronController.startDepositsUpdateCronJob();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

var app = express();
app.listen(process.env.PORT || 4000,
    () => console.log("Server is running...", process.env.PORT || 4000));

db.connect();

app.use(cors({
    // origin: 'https://www.kryptoinvestmentcastle.com',
    // origin: (origin, callback) => callback(null, true),
    origin: process.env.CLIENT_URL,
    credentials: true
}));
console.log(process.env.CLIENT_URL);
// app.use(cors());
app.use(requestIP.mw());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

module.exports = app;
