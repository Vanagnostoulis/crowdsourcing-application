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
var maps = require('./node/maps.js');
const fuzzy = require('fuzzball');
const result=require('./node/search_results/getfinalResults.js')
const jwt = require('jsonwebtoken');

db = require('./node/search_results/search-database.js');

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



//require('./node/authentication/password_reset.js')(app, con, bcrypt,async,crypto,nodemailer)
require('./node/authentication/login.js')(app, con, bcrypt)
require('./node/authentication/register.js')(app, con, bcrypt)
require('./node/authentication/facebook.js')(app, con)            /* login and register with fb */
require('./node/authentication/logout.js')(app, con) 
require('./RESTfulAPI/Products/GetProducts.js')(app, con)
require('./RESTfulAPI/Products/DeleteProducts.js')(app, con,jwt)
require('./RESTfulAPI/Products/PostProducts.js')(app, con, maps, jwt)
require('./RESTfulAPI/Products/PutProducts.js')(app, con, jwt)
require('./RESTfulAPI/Products/PatchProducts.js')(app, con, jwt)
require('./RESTfulAPI/Shops/GetShops.js')(app, con)
require('./RESTfulAPI/Shops/DeleteShops.js')(app, con, jwt)
require('./RESTfulAPI/Shops/PostShops.js')(app, con, maps,jwt)
require('./RESTfulAPI/Shops/PutShops.js')(app, con, jwt)
require('./RESTfulAPI/Shops/PatchShops.js')(app, con, jwt)
require('./RESTfulAPI/Prices/GetPrices.js')(app, con)
require('./node/search_results/results.js')(app, con)
require('./node/search_results/details.js')(app, con)
require('./node/search_results/more.js')(app, result)
require('./node/search_results/insert_address.js')(app, con,maps)
require('./node/search_results/insertDrink.js')(app, con,maps)
require('./node/settings_help.js')(app,con)
require('./RESTfulAPI/Prices/PostPrices.js')(app, con,jwt)
require('./RESTfulAPI/Authentication/apiLogin.js')(app, con, bcrypt, jwt)
require('./RESTfulAPI/Authentication/apiLogout.js')(app, con, bcrypt, jwt)
bcrypt.hash('admin', 10, function(err, bcryptedPassword) {
  if (err) throw err;
  var hash = bcryptedPassword;
  sql = "Update Users Set Password= '" + hash + "' WHERE Username = 'admin';" ;
  console.log(sql);
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log("Admin inserted");
    });
  });

app.post('/search',function(req,res){
	res.clearCookie("Search")
	res.cookie("Search", {
		input:req.body.search
              }, {
                expire: 24 * 60 * 60 * 1000
         });
	db.queries(con,fuzzy,req.body.search,null,res,result)
})
/* get method -- request and respond */
app.get('/', authenticationMiddleware, async function(req, res) {
  /* upload index.ejs to some port (3000look at the end) */
  /* open on localhost:3000/ */
	
  res.render('user', {
    username: req.cookies.userData.user,
    lat: null,
    lon: null,
    state: null,
    region: null,
    street: null,
    num: null,
    pcode: null
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

/*
app.post('/search-input', function(req, res) {
	console.log(req.body.name);
}) */
}
