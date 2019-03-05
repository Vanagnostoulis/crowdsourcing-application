module.exports = function (app,con, bcrypt, jwt){

	app.post('/observatory/api/logout',

	function (req, res, next) {
    var flag = false;
    var token = req.headers['x-observatory-auth'];
    if (!token)
      return res.status(401).send( "401-Not Authorized");

    sql = "Select * from Blacklist Where Token = " +"'" + token + "'";
    con.query(sql, function (err, result) {
    if(err)
      throw err;
    if(result.length != 0 )
      flag = true;
   } );
   if(flag)
    return res.status(403).send( "403-Forbidden");

    jwt.verify(token, 'pame ligo', function(err, decoded) {
      if (err)
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

      // if everything good, save to request for use in other routes
      req.username = decoded.username;
    });
      console.log("NEXTTTTTT");
      return next();

  },

	async function(req, res, next){
		sql = "insert into Blacklist(Token) values ('" + req.headers['x-observatory-auth'] + "');";
	 	con.query(sql, function (err, result) {
			if(err)
				throw err;
		 } )
		res.send(JSON.stringify({ message: "OK"}));
	});
}
