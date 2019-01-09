const express = require('express')			/* basic app for interaction client - server */
const app = express() 						/* for catching get and post methods */
const bodyParser = require('body-parser');	/* for passing variables to client */
const bcrypt = require('bcrypt');			/* for password encryption */

/* Connect to mysql */
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12!17(1518",
  database: "project"
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


/* post method -- request and respond */
/* catch login submission */
app.post('/login', function (req, res) { 
  /* variables for login */
  
  username = req.body.uname; /* name = "uname" in javascript on some placeholder */ 
  password = req.body.psw;
  
  //to compare password that user supplies in the future
  var arr = username.split('@')
  var sql = "SELECT Password, Username FROM Users Where " + 
  		"Domain_Id = (Select Domain_Id from Email_Domains where Domain_Name = '" + arr[1] + "')" + 
  		"and Local_Part = '" + arr[0] + "'";
  
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result[0])
    if(result[0] == null) {
    	res.render('index', {authentication_failed: "Το όνομα χρήστη δεν ταιριάζει με το συνθηματικό.",
    						 password_mismatch: null,
    						 error_user_exist: null
    				});	
    }
    else {
    	hash = result[0].Password
    	bcrypt.compare(password, hash, function(err, doesMatch){
  			if (doesMatch){
  	 			res.render('user', {username: result[0].Username});
  			}else{
     			res.render('index', {authentication_failed: "Το όνομα χρήστη δεν ταιριάζει με το συνθηματικό.",
    						 password_mismatch: null,
    						 error_user_exist: null
    				});
  			}
  		});
  	}
   	console.log("username checked.");
  });
   
  
  console.log("Entered to login");
  console.log("username: " + username);
  console.log("password: " + password);
})

app.post('/register', function (req, res) {
  /* variables for register */
  email = req.body.email;
  password = req.body.pass_reg;
  repeat = req.body.repass_reg;
  username = req.body.reg_uname;
 
  if(password != repeat) {
  	res.render('index', { authentication_failed: null, 
  				          password_mismatch: "Error password mismatch", 
  				          error_user_exist: null
  				      });
  } 
  else {
  	var sql = ""
	
  	splitemail = email.split('@');
  
  	sql = "INSERT IGNORE INTO Email_Domains (Domain_Name) VALUES ('" + splitemail[1] + "')"
  	con.query(sql, function (err, result) {
  	 	if (err) throw err;	
  	})
  	
  	sql = "Select Domain_Id from Email_Domains where Domain_Name = '" + splitemail[1] + "'"; 
  	con.query(sql, function (err, result) {
  	 	if (err) throw err;		 	 
  		var domainid = result[0].Domain_Id;
  	 	sql = "select exists(select * from Users where Local_Part = '" 
  	 		+ splitemail[0] + "' and Domain_Id = " + domainid + ")";
  	 	
  	 	con.query(sql, function (err, result) {
  	 		if (err) throw err;	
  	 		
  	 		exists = result[0]["exists(select * from Users where Local_Part = '" 
  	 		+ splitemail[0] + "' and Domain_Id = " + domainid + ")"]
  	 		
  	 		if(exists) {
  	 			res.render('index', {authentication_failed:null, 
  	 			                     password_mismatch: null, 
  	 			                     error_user_exist : "Φαίνεται πως κάποιος χρήστης χρησιμοποιεί το ίδιο e-mail." 
  	 			              })
			} else {
  	 			/* if email duplicate do something */
  	 			bcrypt.hash(password, 10, function( err, bcryptedPassword) {
  					if(err) throw err;
  					var hash = bcryptedPassword;
  		
  					sql = "Insert into Users (Username, Password, Local_Part, Domain_Id) values ('" + 
  					username + "','" + hash + "','" + splitemail[0] + "'," + domainid + ")"  

  					con.query(sql, function (err, result) {
    					if (err) throw err;
    					console.log("User inserted");
    					res.render('user', {username: username});
  					}); 
  				});
  			}  
  		});
  	});  	
  	
  }
  
  console.log("Entered to register");
  console.log(username); /* print */
  console.log(password);
  console.log(repeat);
  console.log(email);
  
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

/************* Social Login ***************/

/* Facebok */
const session = require('express-session')
const cookieParser = require('cookie-parser');
const passport = require('passport');
const util = require('util');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('./configuration/config');

app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());

// Passport session setup.
passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});
// Use the FacebookStrategy within Passport.
passport.use(new FacebookStrategy({
	clientID: config.facebook_api_key,
	clientSecret:config.facebook_api_secret ,
	callbackURL: config.callback_url,
	profileFields: ['id', 'emails', 'displayName'] //This
},
  	function(accessToken, refreshToken, profile, done) {
  		process.nextTick(function () {
      	//Check whether the User exists or not using profile.id
      	//Further DB code.
      	return done(null, profile);
	});
  }
));

/****************/

app.get('/log', ensureAuthenticated, function(req, res){
  
  res.render('user', { username: req.user.displayName });
});

//Passport Router
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
       successRedirect : '/log',
       failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

/*****************/

app.get('/reg', ensureAuthenticated, function(req, res){
    console.log(req.user.emails);
    splitemail = req.user.emails.split('@');
  
  	sql = "INSERT IGNORE INTO Email_Domains (Domain_Name) VALUES ('" + splitemail[1] + "')"
  	con.query(sql, function (err, result) {
  	 	if (err) throw err;	
  	})
  	
  	sql = "Select Domain_Id from Email_Domains where Domain_Name = '" + splitemail[1] + "'"; 
  	con.query(sql, function (err, result) {
  	 	if (err) throw err;		 	 
  		var domainid = result[0].Domain_Id;
  		sql = "Insert into Users (Domain_Id, Local_part, Username) values (" + 
  		domainid + ",'" + splitemail[0] + "','" + req.user.displayName + "')";
  	 	
  	 	con.query(sql, function (err, result) {
  	 		if (err) throw err;	
  	 	});
  	 });
  	 
  	res.render('user', { username: req.user.displayName });
});

//Passport Router
app.get('/reg/facebook', passport.authenticate('facebook'));
app.get('/reg/facebook/callback',
  passport.authenticate('facebook', {
       successRedirect : '/reg',
       failureRedirect: '/register'
  }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/reg')
}

/***************************/
