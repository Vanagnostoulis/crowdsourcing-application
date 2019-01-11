module.exports = function(app) {

/************* Social Login ***************/

/* Facebok */
const session = require('express-session')
const cookieParser = require('cookie-parser');
const passport = require('passport');
const util = require('util');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('../configuration/config');

app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', 
					key: 'sid',
					resave: true,
    				saveUninitialized: true
					}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
	clientID: config.facebook_api_key,
	clientSecret:config.facebook_api_secret ,
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
// Passport session setup.
passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

/****************/

app.get('/log', ensureAuthenticated, function(req, res){
  
  res.render('user', { username: req.user.displayName });
});

//Passport Router

//Passport Router
app.get('/auth/facebook', passport.authenticate('facebook', {callbackURL: config.callback_url_log}));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
  	   callbackURL: config.callback_url_log,
       successRedirect : '/log',
       failureRedirect: '/login',
       scope : ['email']
  }),
  
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


app.get('/reg', ensureRegistered, function(req, res){
    console.log(req.user);
    splitemail = req.user.emails[0].value.split('@');
  
  	sql = "INSERT IGNORE INTO Email_Domains (Domain_Name) VALUES ('" + splitemail[1] + "')"
  	con.query(sql, function (err, result) {
  	 	if (err) throw err;	
  	})
  	
  	sql = "Select Domain_Id from Email_Domains where Domain_Name = '" + splitemail[1] + "'"; 
  	con.query(sql, function (err, result) {
  	 	if (err) throw err;		 	 
  		var domainid = result[0].Domain_Id
  		console.log(domainid)
  		sql = "Insert into Users (Domain_Id, Local_part, Username) values (" + 
  		domainid + ",'" + splitemail[0] + "','" + req.user.displayName + "')";
  	 	
  	 	con.query(sql, function (err, result) {
  	 		if (err) throw err;	
  	 	});
  	 });
  	 
  	res.render('user', { username: req.user.displayName });
});

//Passport Router
app.get('/reg/facebook', passport.authenticate('facebook', {callbackURL: config.callback_url_reg}));
app.get('/reg/facebook/callback',
  passport.authenticate('facebook', {
  	   callbackURL: config.callback_url_reg,
       successRedirect : '/reg',
       failureRedirect: '/register',
       scope : ['email']
  }),
  
  function(req, res) {
    res.redirect('/');
  }
);

function ensureRegistered(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/register')
}

}
