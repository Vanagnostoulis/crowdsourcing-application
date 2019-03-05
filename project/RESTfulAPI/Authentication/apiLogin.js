var VerifyToken = require('../VerifyToken.js');

module.exports = function (app,con, bcrypt, jwt){

	app.post('/observatory/api/login', function(req,res){
		if (!req.body.username || !req.body.password)
      res.status(400).send("400 - Bad Request");
     else{
       username = req.body.username; /* name = "uname" in javascript on some placeholder */
       password = req.body.password;

       var sql = "SELECT Password FROM Users Where  Username = '" + username + "';";

       con.query(sql, function(err, result) {
         if (err) throw err;
         if (result[0] == null) {
           res.status(410).send("410 - Incorrect username or password");
         } else {
           hash = result[0].Password
           bcrypt.compare(password, hash, function(err, doesMatch) {
             if (doesMatch) {
                 /*choose which coordinates to store at the cookie(ex. default users' coordinates).
                 If the user wants to change them for a specific search you can change
                 them inside the cookie too*/
								 var admin = false;
								 var sql2 = "SELECT Admin FROM Users Where  Username = '" + username + "';";
								 con.query(sql2, function(err, result){
									 if(result[0].Admin == 1)
									 	admin = true;
									var token = jwt.sign({ username: username, admin: admin }, 'pame ligo', {
                  expiresIn: 86400 // expires in 24 hours
                  });
                  res.status(200).send({ auth: true, token: token });
 								 console.log("Authenticated");
								 });
								 // var token = jwt.sign({ username: username, admin: admin }, 'pame ligo', {
                 // expiresIn: 86400 // expires in 24 hours
                 // });
								 // console.log("testtttttttttttttttttttttttttttt" + admin);
                 // res.status(200).send({ auth: true, token: token });
								 // console.log("Authenticated");
             } else {
               res.status(410).send("410 - Incorrect username or password");
             }
           });

         }
       });
     }
	})
}
