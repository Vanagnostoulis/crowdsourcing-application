module.exports = function (app,con, jwt){

	app.post("/observatory/api/prices",

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

	 function (req, res) {
		var Price = parseInt(req.body.Price);
		var dateFrom = req.body.dateFrom;
		var dateTo = req.body.dateTo;
		var Drink_Id = parseInt(req.body.Drink_Id);
		var Store_Id= parseInt(req.body.Store_Id);
		var cnt = 0;

		if(body.Price) cnt++;
		if(body.dateFrom) cnt++;
		if(body.dateTo) cnt++;
		if(body.Drink_Id) cnt++;
		if(body.Store_Id) cnt++;

		if(cnt != 5)
			return res.status(400).send( "400-Bad Request");


		sql = "INSERT INTO Drinks (Price, Store_Id, Start_Day, Finish_Day, Drink_Id) VALUES ( "
		      	+ Price + ","+ Store_Id +",'" + dateFrom +"','" +
		         dateTo +"'," + Drink_Id +");";
		console.log("query for POST PRICES:");
		console.log(sql);
		con.query(sql, function (err, result) {
			if (err) throw err;
			console.log(result);
			res.status(203).send( "203-Accepted");
		})
	})
}
