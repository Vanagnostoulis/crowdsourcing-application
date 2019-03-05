module.exports = function(app, con) {

  /************* Facebook Login / Register ***************/

  /* Initializations */
  const session = require('express-session')
  const cookieParser = require('cookie-parser');
  const passport = require('passport');
  const util = require('util');
  const FacebookStrategy = require('passport-facebook').Strategy;
  const config = require('../../configuration/config');

  app.use(cookieParser());
  app.use(session({
    secret: 'keyboard cat',
    key: 'sid',
    resave: true,
    saveUninitialized: true,
    //XREIAZETAI SECURE COOKIE GIA NA XRHSIMOPOIHSEI HTTPS,
    //omws thelei kapoia allagh h synarthsh gia na leitourghsei
    
    //cookie: {secure: true}
  }));
  app.use(passport.initialize());
  app.use(passport.session()); 

  passport.use(new FacebookStrategy({
      clientID: config.facebook_api_key,
      clientSecret: config.facebook_api_secret,
      profileFields: ['id', 'emails', 'displayName'] //This
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
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

  /******* Login using facebook *********/
 
  //Passport Router, waits call in /auth/facebook
  app.get('/auth/facebook', passport.authenticate('facebook', {
    callbackURL: config.callback_url_log
  }));
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      callbackURL: config.callback_url_log,
      successRedirect: '/log',
      failureRedirect: '/login',
      scope: ['email']
    }),

    function(req, res) {
      res.redirect('/');
    }
  );

  app.get('/logout', function(req, res) {
    req.logout();
    res.clearCookie("userData");
    res.redirect('/');
  });

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/')
  }

  app.get('/log', ensureAuthenticated, function(req, res) {

    /*choose which coordinates to store at the cookie(ex. default users' coordinates).
    If the user wants to change them for a specific search you can change
    them inside the cookie too*/
   
    res.cookie("userData", {
      user: req.user.displayName,
      permission: 'user',
      coordinates: {
        longitude: 0,
        latitude: 0
      }
    }, {
      expire: 24 * 60 * 60 * 1000
    });
    res.render('user', {
      username: req.user.displayName,
      lat: null,
	  lon: null,
	  state: null,
	  region: null,
	  street: null,
	  num: null,
	  pcode: null
    });
  });

  app.get('/login', function(req,res) {
  res.render('index', {
    authentication_failed: null,
    password_mismatch: null,
    error_user_exist: null,
    error_fb_account_exist: null
  });
})


/******** Register using facebook **************/

  //Passport Router, waits call in /reg/facebook
  app.get('/reg/facebook', passport.authenticate('facebook', {
    callbackURL: config.callback_url_reg
  }));
  app.get('/reg/facebook/callback',
    passport.authenticate('facebook', {
      callbackURL: config.callback_url_reg,
      successRedirect: '/reg',
      failureRedirect: '/register',
      scope: ['email']
    }),

    function(req, res) {
      res.redirect('/');
    }
  );

  function ensureRegistered(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/register')
  }
  /* If incoming request to reg: */
  app.get('/reg', ensureRegistered, function(req, res) {
    console.log(req.user)
    fake_mail = [null,null]
    fake_mail[0] = req.user.id;
    fake_mail[1] = 'facebook.com';
    sql = "INSERT IGNORE INTO Email_Domains (Domain_Name) VALUES ('" + fake_mail[1] + "')"
      con.query(sql, function(err, result) {
        if (err) throw err;
      })
    
	sql = "Select Domain_Id from Email_Domains where Domain_Name = '" + fake_mail[1] + "'";
      con.query(sql, function(err, result) {
        if (err) throw err;
        var domainid = result[0].Domain_Id;
	    
	
		sql = "select exists(select * from Users where Local_Part = '" +
		      fake_mail[0] + "' and Domain_Id = " + domainid+ ")";

		    con.query(sql, function(err, result) {
		      if (err) throw err;

		      exists = result[0]["exists(select * from Users where Local_Part = '" +
		        fake_mail[0] + "' and Domain_Id = " + domainid + ")"
		      ]

		      if (exists) {
		        res.render('index', {
		          authentication_failed: null,
		          password_mismatch: null,
		          error_user_exist: null ,
		          error_fb_account_exist: "Φαίνεται ότι ο λογαριασμός αυτός χρησιμοποιείται ήδη."
		        })
		      } 
		      
		     else {
				sql = "INSERT IGNORE INTO Email_Domains (Domain_Name) VALUES ('" + fake_mail[1] + "')"
				con.query(sql, function(err, result) {
				  if (err) throw err;
				})
			  
				sql = "Select Domain_Id from Email_Domains where Domain_Name = '" + fake_mail[1] + "'";
				con.query(sql, function(err, result) {
				  if (err) throw err;
				  var domainid = result[0].Domain_Id
				  console.log("Second log")
				  console.log(domainid)
				  sql = "Insert into Users (Domain_Id, Local_part, Username) values (" +
					domainid + ",'" + fake_mail[0] + "','" + req.user.displayName + "')";

				  con.query(sql, function(err, result) {
					if (err) throw err;
				  });
				});

				/*choose which coordinates to store at the cookie(ex. default users' coordinates).
				If the user wants to change them for a specific search you can change
				them inside the cookie too*/
				res.cookie("userData", {
				  user: req.user.displayName,
				  permission: 'user',
				  coordinates: {
					longitude: 0,
					latitude: 0
				  }
				}, {
				  expire: 24 * 60 * 60 * 1000
				});
				res.render('user', {
				  username: req.user.displayName,
				  lat: null,
				  lon: null,
				  state: null,
				  region: null,
				  street: null,
				  num: null,
				  pcode: null
				});
			  }
		});
	  });
	});
}
