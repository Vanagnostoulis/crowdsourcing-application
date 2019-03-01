const express = require('express')			/* basic app for interaction client - server */
const app = express() 						/* for catching get and post methods */
const bodyParser = require('body-parser');	/* for passing variables to client */
const bcrypt = require('bcrypt');     /* for password encryption */
const config = require('./configuration/config');
const cookieParser = require('cookie-parser');
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const fs = require('fs');
var https = require('https');

/* Connect to mysql */
app.use(cookieParser());

/*SXOLIO GIA AUTHORIZATION:
Geia na deis, mesa se kapoio arxeio, an enas user einai tautopoihmenos
alla kai ti permission exei prepei na kaneis
const cookieParser = require('cookie-parser');
app.use(cookieParser());
twra elegxeis an einai  sundedemenos me thn sunthhkh:
if (req.cookies && req.cookies.userData )
to username to pairneis ap to req.cookies.userData.user
kai to perimission ap to req.cookies.userData.permission
*/

/* Connect to mysql */
var mysql = require('mysql');
global.test = ""
var con = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to mysql!");
});

global.database = {}
con.query(sql, function(err, result) {
	if( err ) throw err;
	
})

var server = https.createServer({
  key: fs.readFileSync('certificate/server.key'),
  cert: fs.readFileSync('certificate/server.cert')
}, app).listen(3000, () => {
  console.log('Listening...')
})

app.use(express.static('public')); /* listen to pathtoproject/public for files like css */
app.use(bodyParser.urlencoded({
  extended: true
})); /* listen to input text to their names */
app.set('view engine', 'ejs') /* use embedded javascript to communicate with client */

/* get method -- request and respond */
app.get('/', authenticationMiddleware, async function(req, res) {
  /* upload index.ejs to some port (3000look at the end) */
  /* open on localhost:3000/ */

  res.render('user', {
    username: req.cookies.userData.user
  });
})

function authenticationMiddleware(req, res, next) {
  if (req.cookies && req.cookies.userData) {
    console.log("The user is already logged in");
    return next();
  }
  res.render('index', {
    authentication_failed: null,
    password_mismatch: null,
    error_user_exist: null,
    error_fb_account_exist: null
  });

//var http = require('http').Server(app);
var io = require('socket.io')(server);
io.on('connection', function (socket) {
  socket.on('search-input', function (data) {
    console.log(data);
  });
});

require('./node/authentication/password_reset.js')(app, con, bcrypt,async,crypto,nodemailer)
require('./node/authentication/login.js')(app, con, bcrypt)
require('./node/authentication/register.js')(app, con, bcrypt)
require('./node/authentication/facebook.js')(app, con)            /* login and register with fb */
require('./node/authentication/logout.js')(app, con) 
require('./RESTfulAPI/Products/GetProducts.js')(app, con)
require('./RESTfulAPI/Products/DeleteProducts.js')(app, con)
require('./RESTfulAPI/Products/PostProducts.js')(app, con)
require('./RESTfulAPI/Products/PutProducts.js')(app, con)
require('./RESTfulAPI/Products/PatchProducts.js')(app, con)
require('./RESTfulAPI/Shops/GetShops.js')(app, con)
require('./RESTfulAPI/Shops/DeleteShops.js')(app, con)
require('./RESTfulAPI/Shops/PostShops.js')(app, con)
require('./RESTfulAPI/Shops/PutShops.js')(app, con)
require('./RESTfulAPI/Shops/PatchShops.js')(app, con)
require('./RESTfulAPI/Prices/GetPrices.js')(app, con)

/*
app.post('/search-input', function(req, res) {
	console.log(req.body.name);
}) */
}
