module.exports = function (app,con){
	
	app.patch('/observatory/api/shops/:id', function(req,res){
		var id = req.params.id;
		var flag;
		var name = req.body.name;
	    // I NEED TO GET THE TYPE ALSO
	    var storeAddress = req.body.addr;
	    var storeNo = parseInt(req.body.no);
	    var storePostal = parseInt(req.body.postal);
	    var storeRegion = parseInt(req.body.region);
	    var storeLng = parseInt(req.body.lng);
	    var storeLat = parseInt(req.body.lat);
	    var tags = req.body.tags;
	    var tagsObj = tags.split(",");

		if (storeAddress != '')
			flag=1;
		if (storeNo!= '')
			flag=2;
		if (storePostal != '')
			flag=3;
		if (storeRegion!= '')
			flag=4;
		if (storeLng != '')
			flag=5;
		if (storeLat != '')
			flag=6;
		if (name != '')
			flag=7;

		switch(flag){
			case 1:
    			sql = "UPDATE Store_Address SET Street= '"+storeAddress+"' WHERE Store_Id = "+ id+";";
				console.log("CASE 1, query for SHOPS UPDATE:");
				console.log(sql);
				con.query(sql, function (err, result) {
				  if (err) throw err; 
				  console.log(result);
				})
				break;
			case 2:
				sql = "UPDATE Store_Address SET Num = "+storeNo+" WHERE Store_Id = "+ id+";";
				console.log("CASE 2, query for SHOPS UPDATE:");
				console.log(sql);
				con.query(sql, function (err, result) {
				  if (err) throw err; 
				  console.log(result);
				})
				break;
			case 3:
				sql = "UPDATE Store_Address SET Postal_Code= " + storePostal +" WHERE Drink_Id = " + id+ ";";
				console.log("CASE 3, query for SHOPS UPDATE:");
				console.log(sql);
				con.query(sql, function (err, result) {
				  if (err) throw err; 
				  console.log(result);
				})
				break;
			case 4:
				sql = "UPDATE Store_Address SET Region = '"+storeRegion+"' WHERE Store_Id = "+ id+";";
				console.log("CASE 4, query for SHOPS UPDATE:");
				console.log(sql);
				con.query(sql, function (err, result) {
				  if (err) throw err; 
				  console.log(result);
				})
				break;
			case 5:
				sql = "UPDATE Store SET Longtitude = "+ storeLng+" WHERE Store_Id = "+ id+";";
				console.log("CASE 5, query for SHOPS UPDATE:");
				console.log(sql);
				con.query(sql, function (err, result) {
				  if (err) throw err; 
				  console.log(result);
				})
				break;
			case 6:
				sql = "UPDATE Store SET Latitude = "+ storeLat+" WHERE Store_Id = "+ id+";";
				console.log("CASE 6, query for SHOPS UPDATE:");
				console.log(sql);
				con.query(sql, function (err, result) {
				  if (err) throw err; 
				  console.log(result);
				})
				break;
			case 7:
				sql = "UPDATE Store SET Name = '"+ name+"' WHERE Store_Id = "+ id+";";
				console.log("CASE 7, query for SHOPS UPDATE:");
				console.log(sql);
				con.query(sql, function (err, result) {
				  if (err) throw err; 
				  console.log(result);
				})
				break;
		}
	})
}