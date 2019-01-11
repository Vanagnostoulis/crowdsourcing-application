module.exports = function(app, con, bcrypt) {
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

}
