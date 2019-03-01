module.exports = function (app,con){
// html for post /forgot needed
app.post('/forgot', function(req, res, next) {
  var token;
  //take the useremail from BODY.UMAIL and find if there is a valid 
  // username in the databasae with the given email 
  // hold the username of given email in order to change the token
  // which is the valid link for password reset
  var useremail = req.body.umail; /* name = "uname" in javascript on some placeholder */
  if (!(useremail.includes("@"))){
    res.render('index', {
      authentication_failed: "Δώσε ξανά email του λογαριασμού",
      password_mismatch: null,
      error_user_exist: null,
      error_fb_account_exist: null
      });
  }
  else{
  	// find username with given email
    var arr = useremail.split('@')
    var sql = "SELECT Username FROM Users Where " +
      "Domain_Id = (Select Domain_Id from Email_Domains where Domain_Name = '" + arr[1] + "')" +
      "and Local_Part = '" + arr[0] + "'";
    con.query(sql, function(err, result) {
      if (err) throw err;
        console.log(result[0]);
      if (result[0] == null) {
        res.render('index', {
          authentication_failed: "Δεν υπάρχει αυτό το email που έδωσες",
          password_mismatch: null,
          error_user_exist: null,
          error_fb_account_exist: null
          });
          //does it stop here?????? I HOPE IT DOES
      }
      else{
      var username = result[0].Username;
      }
    })
  }
  async.waterfall([
	function(done) {
		// crete a token for the user
		crypto.randomBytes(30, function(err, buf) {
		token = buf.toString('hex');
		done(err, token);
		});
    },
    function(token, user, done) {
    	// add token for the user in database
    	var sql = "UPDATE Users SET Tokens = "+ token +" WHERE Username = "+username;
        con.query(sql, function(err, result) {
          if (err) throw err;
        });
        // and send email to him the recovery link
        var smtpTransport = nodemailer.createTransport({
          service: 'SendGrid', 
          auth: {
            user: 'kappakeepo',
            pass: '123456789a'
          }
        });
        var mailOptions = {
          to: useremail,
          from: 'SoftEngProject@hackuna.org',
          subject: 'Hackuna Project Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
        });
      }
    ], function(err) {
      if (err) return next(err);
      // go to start page we are done with the request of new password
      res.redirect('/index');
  }); 
})

app.get('/reset/:token', function(req, res) {
	// check if token is legit and then go to the form for new password 
	var sql = "SELECT Username FROM Users Where Tokens = '"+ req.params.token+"';";
	con.query(sql, function(err, result) {
		if (result[0]== null) {
			res.render('index', {
		      authentication_failed: 'Password reset token is invalid or has expired.',
		      password_mismatch: null,
		      error_user_exist: null,
		      error_fb_account_exist: null
		   });
		}
		res.render('reset');
	});
});

app.post('/reset/:token', function(req, res) {
	async.waterfall([
	    function(done) {
	    	password = req.body.pass_reg;
			repeat = req.body.repass_reg;
			if(password != repeat) {
				res.render('reset', { 
					authentication_failed: null, 
					password_mismatch: "Error password mismatch", 
					error_user_exist: null
				});
			} 
			else{
				//find email and check if legit token
				var sql = "SELECT Domain_Name,Local_Part,Username FROM Email_Domains,Users WHERE Email_Domains.Domain_Id = "+
					+"(SELECT Users.Domain_Id where Tokens = '" +req.params.token+ "';)";
  				console.log(sql);
				con.query(sql, function(err, result) {
					if (result[0]==NULL) {
						res.render('index', {
					      authentication_failed: 'Password reset token is invalid or has expired.',
					      password_mismatch: null,
					      error_user_exist: null,
					      error_fb_account_exist: null
					   });
					}
					else{
						var username = result[0].Username;
						var useremail = result[0].Local_Part+ '@'+ result[0].Domain_Name;
					}
				})
				// legit user and password match
				bcrypt.hash(password, 10, function( err, bcryptedPassword) {
					if(err) throw err;
  					var hash = bcryptedPassword;
  					sql = "UPDATE Users SET Password = "+ hash +"WHERE Tokens = '"+req.params.token+ "';";  
  					console.log(sql);
  					con.query(sql, function (err, result) {
    					if (err) throw err;
    					console.log("Password Changed for User");
  					}); 
  				});
  			}  
		},
	    function(user, done) {
		    var smtpTransport = nodemailer.createTransport({
	        	service: 'SendGrid', 
	        	auth: {
	            	user: 'kappakeepo',
	            	pass: '123456789a'
	          	}
	        });
	        var mailOptions = {
	        	to: useremail,
	        	from: 'SoftEngProject@hackuna.org',
	        	subject: 'Hackuna Project your password has been changed',
		   		text: 'Hello,\n\n' +
				'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
		    };
	        smtpTransport.sendMail(mailOptions, function(err) {
	          console.log('mail sent');
	        });
	    },
		function(err) {
    		res.redirect('/index');
  		}
  	]);
});
}
