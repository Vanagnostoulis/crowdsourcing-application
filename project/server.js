const express = require('express')			/* basic app for interaction client - server */
const app = express() 						/* for catching get and post methods */
const bodyParser = require('body-parser');	/* for passing variables to client */
const bcrypt = require('bcrypt');     /* for password encryption */
const config = require('./configuration/config');
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

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

app.use(express.static('public')); /* listen to pathtoproject/public for files like css */
app.use(bodyParser.urlencoded({
  extended: true
})); /* listen to input text to their names */
app.set('view engine', 'ejs') /* use embedded javascript to communicate with client */

/* get method -- request and respond */
app.get('/', authenticationMiddleware, async function(req, res) {
  /* upload index.ejs to some port (8888 look at the end) */
  /* open on localhost:8888/ */

  res.render('user', {
    username: req.cookies.userData.user
  });


})

require('./password_reset.js')(app, con, bcrypt,async,crypto,nodemailer)
require('./node/authentication/login.js')(app, con, bcrypt)
require('./node/authentication/register.js')(app, con, bcrypt)
require('./node/authentication/facebook.js')(app) /* login and register with fb */
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


app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})

function authenticationMiddleware(req, res, next) {
  if (req.cookies && req.cookies.userData) {
    console.log("The user is already logged in");
    return next();
  }
  res.render('index', {
    authentication_failed: null,
    password_mismatch: null,
    error_user_exist: null
  });
}