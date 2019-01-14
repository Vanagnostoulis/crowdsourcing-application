module.exports = function (app,con){
	
	app.patch('/observatory/api/products/:id', function(req,res){
		var id = req.params.id;
		var flag;
		var currDate =  new Date().toISOString().slice(0, 10).replace('T', ' ');
		var name = req.body.name;
		var description = req.body.dscr;
		var category = req.body.ctgry;
		var tags = req.body.tags;
		var price = parseInt(req.body.prc);   

		if (name != '')
			flag=1;
		if (description != '')
			flag=2;
		if (category != '')
			flag=3;
		if (tags != '')
			flag=4;
		if (price != '')
			flag=5;

		switch(flag){
			case 1:
				sql = "UPDATE Drinks SET Marka = ' " + name+ " ' , Start_Day = ' " + currDate+" ' WHERE Drink_Id = " + id+ " ;";
				console.log("CASE 1, query for UPDATE:");
				console.log(sql);
				con.query(sql, function (err, result) {
				  if (err) throw err; 
				  console.log(result);
				})
				break;
			case 2:
				// retrieve valuss from description 
				// remove all spaces so we can be sure for inputs
				var temp = description.replace(/ /g,'');
				if (parseInt(temp.substring(temp.search('%')-2,100)) > 0)
				// case of 20%
					var alcohol = parseInt(temp.substring(temp.search('%')-2,100));
				else
				// case of 5% 
					var alcohol = parseInt(temp.substring(temp.search('%')-1,100));

				if (parseInt(temp.substring(temp.search('ml')-3,100)) > 0)
				// case of 750ml
					var ml = parseInt(temp.substring(temp.search('ml')-3,100));
				else
				// case of 75ml
					var ml = parseInt(temp.substring(temp.search('ml')-2,100));

				sql = "UPDATE Drinks SET Alcohol = " + alcohol +", Ml = " + ml +", Start_Day = ' " + currDate +" ' WHERE Drink_Id = " + id+ ";";
				console.log("CASE 2, query for UPDATE:");
				console.log(sql);
				con.query(sql, function (err, result) {
				  if (err) throw err; 
				  console.log(result);
				})
				break;
			case 3:
				sql = "UPDATE Drinks SET  Type= ' " + category+" ', Start_Day = ' " + currDate +" ' WHERE Drink_Id = " + id+ ";";
				console.log("CASE 3, query for UPDATE:");
				console.log(sql);
				con.query(sql, function (err, result) {
				  if (err) throw err; 
				  console.log(result);
				})
				break;
			case 4:
				// TAGS SECTION;
				var tagsObj = tags.split(",");
				console.log("NOT IMPLEMENTED YET");
				break;
			case 5:
				sql = "UPDATE Drinks SET  Price= " + price+", Start_Day = ' " + currDate + " ' WHERE Drink_Id = " + id+ ";";
				console.log("CASE 5, query for UPDATE:");
				console.log(sql);
				con.query(sql, function (err, result) {
				  if (err) throw err; 
				  console.log(result);
				})
				break;
		}
	})
}