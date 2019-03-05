module.exports= function(app, con, maps) {

	app.post('/insert_address_store', async function(req,res){
	address = req.body.address;
	location = await maps.getCoordinates(address);
	res.render('user', {
		username: req.cookies.userData.user,
		lat: location.DisplayPosition.Latitude,
		lon: location.DisplayPosition.Longitude,
		state: location.Address.State,
		region: location.Address.City,
		street: location.Address.Street,
		num: location.Address.HouseNumber,
		pcode: location.Address.PostalCode
	});	
})

	app.post('/confirm', function(req,res) {
		state = req.body.state;
		region = req.body.region;
		street = req.body.street;
		num = req.body.num;
		pcode = req.body.pcode;
	
		store_type = req.body.store_type;
		store_name = req.body.store_name;
	
		category = req.body.type;
		name = req.body.mark; 
		tag = req.body.tag;
		description = req.body.alcohol;
		price = req.body.price;
		ml = req.body.ml;
	
		if (ml == ""){ console.log("Right!"); ml=null;}
		else ml='"'+ml+'"';
	
		sql = "Select Store_Id from Store_Address where Street ='" + street + "' and Num = '" + num + "' and Postal_Code = '" + pcode + "' and Region = '" + region + "' ";
		con.query(sql, function(err, result) {
		    if (err) throw err;
		    if (result.length==0) {
		    	console.log("Empty");
		    	sql = "Insert into Store (Type, Name) values ('" + store_type + "','" + store_name + "')";
		    	con.query(sql, function(err,result) {
		    		if (err) throw err;
		    		sql = "select LAST_INSERT_ID()";
		    		con.query(sql, function(err,result) {
		    			if (err) throw err;
		    			id = result[0]['LAST_INSERT_ID()'];
		    			sql = "Insert into Store_Address (Store_Id, Street, Num, Postal_Code, Region) values ('" + id + "','" + street + "','" + num + "','" + pcode + "','" + region + "')"; 
		    			con.query(sql, function(err,result) {
		    				if (err) throw err;
		    				console.log("New store inserted.");
		    			})
		    			sql = "Insert into Drinks (Store_Id, Category, Name, Tag, Description, Price, Ml) values ('" + id + "','" + category + "','" + name + "','" + tag + "','"+ description + "','" + price + "', " + ml + ")";
		    			con.query(sql, function(err,result) {
		    				if (err) throw err;
		    				console.log("Enter: ",result);
		    			})
		    		})
		    	})
		    }

		    else {
		    	id = result[0]['Store_Id'];
		   		sql = "Insert into Drinks (Store_Id, Category, Name, Tag, Description, Price, Ml) values ('" + id + "','" + category + "','" + name + "','" + tag + "','"+ description + "','" + price + "', " + ml + ")";
		    	con.query(sql, function(err,result) {
		    		if (err) throw err;
		    		console.log("Enter: ",result);
		    	})
		   }
		})
    
    /* Gain points */
    username= req.cookies.userData.user;
    console.log("Username: ", username);
    sql = "Select Points from Users where Username='" + username + "'";
    con.query(sql, function(err,result) {
    	if (err) throw err;
    	points = result[0]['Points'];
        console.log("Points value: ",points+5);
       
        sql = "Update Users set Points= "+(points+5).toString()+" where Username = '" + username +"'";
        con.query(sql, function(err,result) {
        	if(err) throw err;
        	console.log("Points inserted");
        })
        res.redirect('/');
    })  
})

	app.post('/update', function(req,res) {
		drink_id = req.body.drink_id;
		description = req.body.description;
		price = req.body.price;
		
		sql = "Update Drinks set Description = '"+description+"', Price = '"+price+"' where Drink_Id = "+drink_id.toString()+"";
		con.query(sql, function(err,result) {
			if (err) throw err;
			console.log("Drink with id: ", drink_id, "updated.")
		})
		res.redirect('/');
	})
	
	
}
