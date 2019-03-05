module.exports= function(app,con,maps) {
	app.post('/insert_address', async function(req,res){
	address = req.body.address;
	location = await maps.getCoordinates(address);
	
	/* Values to insert on user address. */
	region = location.Address.City;
	street = location.Address.Street;
	num = location.Address.HouseNumber;
	pcode = location.Address.PostalCode;
	
	/* Get username from cookie. */
	if(req.cookies.userData){
		username = req.cookies.userData.user;
	
		sql = "Select Domain_Id, Local_Part from Users where Username = '" + username + "'";
		con.query(sql, function(err,res) {
	    	if (err) throw err;
	    	domain_id = res[0]['Domain_Id']
	    	local_part = res[0]['Local_Part']
	    	sql = "Insert into Users_Locations Domain_Id, Local_Part, Region, Street, Num, Postal_Code values ('"+domain_id+"','"+local_part+"','"+region+"','"+street+"','"+num+"','"+pcode+"') ";
		})
			con.query(sql, function(err,result) {
			if (err) throw err;
			console.log("User address inserted.");
			res.redirect('/');
		})
	}
	else res.redirect('/');
    })	
}
