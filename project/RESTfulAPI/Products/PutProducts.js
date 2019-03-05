module.exports = function (app,con, jwt){

	app.put('/observatory/api/products/:id',

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

	async function(req,res){
		var id = req.params.id;
		var Name = req.body.Name;
		var Category = req.body.Category;
    var Description = req.body.Description;
    var Price = parseFloat(req.body.Price);
    var Ml = parseInt(req.body.Ml);
    var Tag = req.body.Tag;
		var Withdrawn = parseInt(req.body.Withdrawn);
		var Store_Id = req.body.Store_Id;
    var cnt = 0 ;
    var body = req.body;
		var data = {};

		//find store id to put in db
		if(body.Name) cnt++;
		if(body.Description) cnt++;
		if(body.Category) cnt++;
		if(body.Price) cnt++;
		if(body.Ml) cnt++;
		if(body.Tag) cnt++;
		if(body.Withdrawn) cnt++;
		if(body.Store_Id) cnt++;

		if(cnt != 8 )
				return res.status(400).send( "400-Bad Request");
		data['Name'] = "'"+ Name + "'";
		data['Description'] = "'"+ Description + "'";
		data['Category'] = "'"+ Category + "'";
		data['Price'] = "'"+ Price + "'";
		data['Ml'] = "'"+ Ml + "'";
		data['Tag'] = "'"+ Tag + "'";
		data['Withdrawn'] = "'"+ Withdrawn + "'";
		data['Store_Id'] = "'"+ Store_Id + "'";

		sql = "UPDATE Drinks SET Description = '" + Description  + "'," + "Price = " + Price + ",";
		sql += "Name = '" + Name + "'," + "Store_Id = " + Store_Id + ",";
		sql += "Category = '" + Category + "'," + "Ml = " + Ml + "," + "Tag = '" + Tag + "',";
		sql +=  "Withdrawn = " + Withdrawn;
		sql += " WHERE Drink_Id = " + id+ ";"

		console.log("query for PUT:");
		console.log(sql);
		con.query(sql, function (err, result) {
		  if (err) throw err;
		  console.log(result);
			res.status(203).send(JSON.stringify(data , null, 200));
		})
	});
}
