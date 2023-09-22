var express=require('express');
var mongoose = require("mongoose");
var session = require('express-session');
const bodyParser = require('body-parser');
const Path = require('path');
var ejs = require('ejs');
const myapp = require('./model/userlogin');
const mainpage = require('./model/mainsp');
const sbsearch = require('./model/dbsearch');
const landingpageroutes = require('./model/landingpages');
const { hostname } = require('os');
// const customer_model = require('./rmsconfig/model/customer');
const wifi = '192.168.29.116'  ;
const port = process.env.PORT ||  8080 ;
const app = myapp.app ;


app.set('port', process.env.port || port); // set express to use this port
app.use(express.static(__dirname));
app.use(express.static(Path.join(__dirname, 'model')))
app.use(express.static(Path.join(__dirname, 'public'))) // configure express to use public folder

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // parse form data client
app.use(express.json());

app.engine('html', require('ejs').renderFile);


module.exports.app = app;


app.listen(port, () => console.log(`Script ser1.js is Running at port ${port}`));