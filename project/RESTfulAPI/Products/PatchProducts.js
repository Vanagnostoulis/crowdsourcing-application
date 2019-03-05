module.exports = function (app,con, jwt){

	app.patch('/observatory/api/products/:id',

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
		var Category = req.body.Category;
    var Description = req.body.Description;
    var Price = parseFloat(req.body.Price);
    var Ml = parseInt(req.body.Ml);
    var Tag = req.body.Tag;
    var Store_Id = parseInt(req.body.Store_Id);
		var Withdrawn = parseInt(req.body.Withdrawn);
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
		if(body.Store_Adress) cnt++;
		if(body.Withdrawn) cnt++;
		if(body.Store_Id) cnt++;

		if(cnt != 1 )
				return res.status(400).send( "400-Bad Request");

		sql = "UPDATE Drinks SET ";

		if(body.Description){
			sql += "Description = '"
			sql += Description;
			sql += "'";
			data['Description'] = Description;
		}
		if(body.Price){
			sql += "Price = ";
			sql += Price;
			data['Price'] = Price;
		}
		if(body.Category){
			sql += "Category = '";
			sql += Category;
			sql += "'";
			data['Category'] = Category;
		}

		if(body.Ml){
			sql += "Ml = '";
			sql += Ml;
			sql += "'";
			data['Ml'] = Ml;
		}
		if(body.Tag){
			sql += "Tag = '";
			sql += Tag;
			sql += "'";
			data['Tag'] = Tag;
		}

		if(body.Store_Id){
			sql += "Store_Id = ";
			sql += Store_Id;
			data['Store_Id'] = Store_Id;
		}
		if (body.Withdrawn) {
			sql += "Withdrawn = ";
			sql += Withdrawn;
			data['Withdrawn'] = Withdrawn;
		}
		if(body.Name){
			sql += "Name = '"
			sql += Name;
			sql += "'";
			data['Name'] = Name;
		}

		sql += " WHERE Drink_Id = " + id+ ";"

		console.log("query for PUT:");
		console.log(sql);
		con.query(sql, function (err, result) {
		  if (err) throw err;
		  console.log(result);

		})
		sql = "SELECT * FROM Drinks WHERE Drink_Id = " + id + ";";
		con.query(sql, function(err, result){
			data['Name'] = "'"+ result[0].Name + "'";
			data['Description'] = "'"+ result[0].Description + "'";
			data['Category'] = "'"+ result[0].Category + "'";
			data['Price'] = "'"+ result[0].Price + "'";
			data['Ml'] = "'"+ result[0].Ml + "'";
			data['Tag'] = "'"+ result[0].Tag + "'";
			data['Withdrawn'] = "'"+ result[0].Withdrawn + "'";
			data['Store_Id'] = "'"+ result[0].Store_Id + "'";
			res.status(203).send( JSON.stringify(data , null, 200));
		});
	});
}
