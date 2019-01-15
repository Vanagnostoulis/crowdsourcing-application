module.exports = function (app,con){

	app.post("/observatory/api/prices", function (req, res) {
		var price = parseInt(req.body.prc);   
		var startDate = req.body.startDate;
		var finDate = req.body.finDate;
		var prodId= parseInt(req.body.prodId);
		var storeId= parseInt(req.body.storeId);

		sql = "INSERT INTO Drinks (Price, Store_Id, Start_Day, Finish_Day, Drink_Id) VALUES ( "
		      	+ price + ","+ storeId +",'" + currDate +"','" +
		         finDate +"'," + prodId +");";
		console.log("query for POST PRICES:");
		console.log(sql);
		con.query(sql, function (err, result) {
			if (err) throw err; 
			console.log(result);
		})
	})
}

