module.exports = function (app,con){

	app.get("/observatory/api/prices", function (req, res) {
		
		var total, offset, queryArgs;
		var flag= false;
		var geoFlag = false;

		if (req.query.start == null)
			var start = parseInt(0);
		else if (req.query.start >= 0 )
			var start = parseInt(req.query.start);
		else
			flag = true;

		if (req.query.count == null)
			var count = parseInt(20);
		else if (req.query.count >= 1)
			var count = parseInt(req.query.count);
		else 
			flag = true;

		if (req.query.geoDist != null && req.query.geoLng != null && req.query.geoLat != null)
		{
			var geoDist = parseInt(req.query.geoDist);
			var geoLng =  parseFloat(req.query.geoLng);
			var geoLat =  parseFloat(req.query.geoLat);
		}
		else if (req.query.geoDist == null && req.query.geoLng == null && req.query.geoLat == null)
			// there is no error in the query because no geo was given
			geoFlag = true;
		else
			// BAD REQUEST
			flag = true;

		// if both are given and their values are in the format of xx-xx-xx.
		if (req.query.dateFrom != null && req.query.dateTo != null && (req.query.dateTo.split("-").length==3) && (req.query.dateFrom.split("-").length==3))
		{
			var dateFrom = req.query.dateFrom;
			var dateTo = req.query.dateTo;
		}
		else if ((req.query.dateFrom == null && req.query.dateTo == null) || req.query.dateTo == req.query.dateFrom)
		{
			var dateFrom =  new Date().toISOString().slice(0, 10).replace('T', ' ');
			// if dates are equal or no date are given, search products with dateFrom today
			var dateTo = true;
		}
		else
			flag = true;

		if (req.query.sort == null)
			var sort = "price|ASC";
		else if (req.query.sort == "geoDist|ASC" || req.query.sort == "geoDist|DESC" || req.query.sort == "price|ASC"
			 || req.query.sort == "price|DESC" || req.query.sort == "dateTo|ASC" || req.query.sort == "dateTo|DESC")
			var sort = req.query.sort;
		else
			flag = true;

/*		PROAIRETIKO LEEI
		if (req.query.shops != null)
			var shops = req.query.shops; // p.x ?shops=2&shops=3 -----> [ '2', '3' ]

		if (req.query.products != null)
			var products = req.query.products;
*/		

		// IF THHERE IS BAD REQUEST STOP without turning of the server
		if (flag)
			{res.status(400).send("400 - Bad Request");}
		else
		{	
			// if no geo are given
			if (geoFlag)
			{
				// find value of total shops. Case 1 search from today, Case 2 search from today until dateTo
				if (dateTo)
					sql = " SELECT COUNT (Drink_Id) AS totalCount FROM Drinks WHERE (Start_Day > '"+ dateFrom+ "');";
			  	else
					sql = " SELECT COUNT (Drink_Id) AS totalCount FROM Drinks WHERE (Start_Day > '"+ dateFrom+ "' AND Finish_Day <= '"+ dateTo+"');";
			  	console.log("SQL FOR TOTAL");
			  	console.log(sql);
			  	con.query(sql, function (err, rows) {
			  	 	total = rows[0].totalCount;
			  	});

				// fix the query arguments
			  	offset = start + count - 1;
			  	queryArgs = sort.split("|");
			  	if (!(queryArgs[0] == "price" || queryArgs[0] == 'dateTo'))
			 		res.status(400).send("400 - Bad Request");
			  	else
			  	{
			  		if (queryArgs[0] == 'price')
			  			queryArgs[0] = 'Price';
					else 
						queryArgs[0] = 'Finish_Day'

					sql = "Select * from Store, Store_Address, Drinks where (Store.Store_Id BETWEEN " + start +" AND " + offset +
						  ") AND (Store_Address.Store_Id BETWEEN " + start + " AND " + offset +
						  ") AND (Store.Store_Id = Store_Address.Store_Id) AND (Drinks.Drink_Id BETWEEN " +start+ " AND " + offset +
						  ") ORDER BY Drinks." +queryArgs[0]+ " " + queryArgs[1] + ";";
					console.log("CASE WITH NO GEOFLAG FOR GET PRICES");
					console.log(sql);
					con.query(sql, function (err, result) {
				  	 	if (err) throw err;
						//console.log(result);
						var i;
						var arr =[];
						var len =result.length;
						for (i = 0; i < len; i++) { 
							arr.push({
								price: result[i].Price,
								date: result[i].Finish_Day.toISOString().slice(0, 10).replace('T', ' '), 
								productName: result[i].Marka,
								productId: result[i].Drink_Id, 
								shopId: result[i].Store_Id,
								shopName: result[i].Name,
								shopsAddress: result[i].Street + ' ' + result[i].Num + ", " + result[i].Postal_Code + ", " + result[i].Region
							});
						}
						res.send(JSON.stringify({ start: start, count: count, total: total ,prices: arr} , null, 200));
				  	});
				}
			}
			// if geo is given 
			else
			{
				
			}


		/* total product	
			sql = " SELECT COUNT (Store_Id) AS totalCount FROM Store";
		  	con.query(sql, function (err, rows) {
		  	 	total = rows[0].totalCount;
		  	});
	
			con.query(sql, function (err, result) {
		  	 	if (err) throw err;
				console.log(result);

				var i;
				var arr =[];
				var len =result.length;
				for (i = 0; i < len; i++) { 
					arr.push({
						price: result[i].Price,
						date: result[i].Finish_Day, 
						productName: result[i].Marka + ,
						productId: result[i].Drink_Id, 
						shopId: result[i].Store_Id,
						shopName: result[i].Name,
						shopsAddress: [result[i].Street + ' ' + result[i].Num + ", " + result[i].Postal_Code + ", " + result[i].Region,
					});
				}
			res.send(JSON.stringify({ start: start, count: count, total: total ,shops: arr} , null, 200));
		  	});
		  	*/
		}
	});
}