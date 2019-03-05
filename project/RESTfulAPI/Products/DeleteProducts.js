module.exports = function (app,con, jwt){

	app.delete('/observatory/api/products/:id',
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
			req.admin = decoded.admin;
		});
			console.log("NEXTTTTTT");
			return next();

	},

	 function(req,res){
		var id = req.params.id;
		/* ******************** ADMIN **************

		sql = "DELETE FROM Drinks WHERE  Drink_Id= " + id+" ;";
		console.log("CASE ADMIN DELETE");
		console.log(sql);
		con.query(sql, function (err, result) {
		  if (err) throw err;
		  console.log(result);
		})
		*/
		if(req.admin){
			sql = "DELETE FROM Drinks WHERE  Drink_Id= " + id+" ;";
			console.log("CASE ADMIN DELETE");
			console.log(sql);
			con.query(sql, function (err, result) {
			  if (err) throw err;
			  console.log(result);
			})
		}
		// ******************** USER **************
		else{
			var status = 1;
			sql = "UPDATE Drinks SET Withdrawn = " + status + "WHERE  Drink_Id= " + id+" ;";
			console.log("CASE USER IN DELETE");
			console.log(sql);
			con.query(sql, function (err, result) {
			  if (err) throw err;
			  console.log(result);
			})
		}
		res.send(JSON.stringify({ message: 'ok'}));
	})
}
