const express = require('express')			/* basic app for interaction client - server */
const app = express() 						/* for catching get and post methods */
const bodyParser = require('body-parser');	/* for passing variables to client */
const bcrypt = require('bcrypt');			/* for password encryption */
const config = require('./configuration/config');

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

app.use(express.static('public'));					/* listen to pathtoproject/public for files like css */ 
app.use(bodyParser.urlencoded({ extended: true })); /* listen to input text to their names */
app.set('view engine', 'ejs')						/* use embedded javascript to communicate with client */

/* get method -- request and respond */
app.get('/', function (req, res) {
  
  /* upload index.ejs to some port (8888 look at the end) */
  /* open on localhost:8888/ */	
  
  res.render('index', {authentication_failed: null, password_mismatch: null, error_user_exist: null});	
})

require('./node/login.js')(app, con, bcrypt)
require('./node/register.js')(app, con, bcrypt)
require('./node/facebook.js')(app) /* login and register with fb */

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.get('/product', function(req, res) {
	sql = "Select * from Drinks";
	con.query(sql, function(err, result) {
		if(err) throw err;
		console.log(result[0]);
		var dict = { ID: result[0].Type, 
					 Name: result[0].Marka,
					 Description: result[0].Alcohol + '%, ' + result[0].Ml + 'ml, '
					 + result[0].Price + '\u20AC' }
		res.send(JSON.stringify(dict));
	});
});


