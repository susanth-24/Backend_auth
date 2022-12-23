const express = require('express');
const env = require('dotenv').config()
const ejs = require('ejs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
//const MongoStore = require('connect-mongo').default;
const MongoStore = require('connect-mongo');
const url="mongodb://localhost:27017/user";
//req.session.loggedin = false;
mongoose.connect('mongodb://localhost:27017/user', (err) => {
    if (!err) {
        console.log("mongodb connection successful");
    } else {
        console.log("mongodb connection failed");
    }
});
var db = mongoose.Connection;
//db.on('error', console.error.bind(console, 'connection error:'));
/*db.on('err', function(err){
    console.error("connection error;", err);
});*/
//db.once('open', function () {

//});

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl:url}),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // two weeks
    }
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));

var index = require('./routes/index');
app.use('/', index);
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});
app.use(function (req, res, next) {
    res.locals.loggedin= req.session.loggedin;
    next();
});
app.listen(3000, function () {
    console.log("server started on port 3000!")
});