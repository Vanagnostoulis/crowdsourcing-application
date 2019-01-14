module.exports = function (app,con){

	app.get('/observatory/api/products/:id', function (req, res) {
		
		var id = req.params.id;
		var flag = false;

		if (req.query.format == null || req.query.format == "json")
			var format = "json";
		else
			flag = true;

		if (flag)
			res.status(400).send("400 - Bad Request");
		else
		{
			sql = "Select * from Drinks where Drink_Id = " + id +";";
			console.log(sql);
			con.query(sql, function (err, row) {
				if (row == 0)
					res.status(404).send( "404 - NOT FOUND");
				else
				{
					var dict =
					{
						id: row[0].Drink_Id,
						name: row[0].Marka,
						description: row[0].Alcohol + '% ,' + row[0].Ml + ' ml, ' + row[0].Price +'euros',
						category: row[0].Type,
						tags: [row[0].Type, row[0].Marka,row[0].Ml],
						withdrawn: row[0].Withdrawn
					};
						res.send(JSON.stringify(dict));
				}
			});
		}
	});

	app.get('/observatory/api/products', function (req, res) {
		// query arguments 
		var total, offset, queryArgs;
		var flag= false;

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

		if (req.query.status == null)
			var status = "ACTIVE";
		else if (req.query.status == "ALL" || req.query.status == "WITHDRAWN" || req.query.status == "ACTIVE")
			var status = req.query.status;
		else 
			flag = true;

		if (req.query.sort == null)
			var sort = "id|DESC";
		else if (req.query.sort == "id|ASC" || req.query.sort == "id|DESC" || req.query.sort == "name|ASC" || req.query.sort == "name|DESC")
			var sort = req.query.sort;
		else
			flag = true;

		// IF THHERE IS BAD REQUEST STOP without turning of the server
		if (flag)
			{res.status(400).send("400 - Bad Request");}
		else
		{// find value of total products	
			sql = " SELECT COUNT (Drink_Id) AS totalCount FROM Drinks";
		  	con.query(sql, function (err, rows) {
		  	 	total = rows[0].totalCount;
		  	});

		 	// fix the query arguments
		  	offset = start + count - 1;
		  	queryArgs = sort.split("|");
		  	if (queryArgs[0] == "id")
		  		queryArgs[0] = "Drink_Id";
		  	else
		  		queryArgs[0] = "Name";

		  	if (status == "ACTIVE") 
		  		status ="(0)";
		  	else if (status == "WITHDRAWN")
		  		status ="(1)";
			else 
		  		status ="(0,1)";

		  	sql = "SELECT * FROM Drinks WHERE Drink_Id BETWEEN "+ start +" AND " + offset +
		  		" AND Drinks.Withdrawn IN "+ status+ " ORDER BY Drinks." +queryArgs[0]+ " " + queryArgs[1] + ";";
			console.log(sql);
			con.query(sql, function (err, result) {
		  	 	if (err) throw err;	
				var i;
				var arr =[];
				var len =result.length;
				for (i = 0; i < len; i++) { 
					arr.push({
						id: result[i].Drink_Id,
						name: result[i].Marka,
						description: result[i].Alcohol + '%' + result[i].Ml + 'ml' + result[i].Price +'euros',
						category: result[i].Type,
						tags: [result[i].Type, result[i].Marka,result[i].Ml],
						withdrawn: Boolean(result[i].Withdrawn)
					});
				}
				res.send(JSON.stringify({ start: start, count: count, total: total ,shops: arr}));
		  	});
		}
	});
}