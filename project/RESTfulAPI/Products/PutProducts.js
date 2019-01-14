module.exports = function (app,con){

	app.put('/observatory/api/products/:id', function(req,res){
		var id = req.params.id;
		var name = req.body.name;
		var description = req.body.dscr;
		var category = req.body.ctgry;
		var tags = req.body.tags;
		var price = parseInt(req.body.prc);   
		var currDate =  new Date().toISOString().slice(0, 10).replace('T', ' ');
		
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

		var tagsObj = tags.split(",");

		//find store id to put in db
		
		sql = "UPDATE Drinks SET Type = '" + category+  "', Marka = '" + name+"', Price = " +
				 price +", Alcohol = " + alcohol +", Ml = " + ml + ", Start_Day = ' " + currDate +" ' WHERE Drink_Id = " + id+ ";";
		console.log("query for PUT:");
		console.log(sql);
		con.query(sql, function (err, result) {
		  if (err) throw err; 
		  console.log(result);
		})
	});
}