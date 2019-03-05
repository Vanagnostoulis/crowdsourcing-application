module.exports = function (app,con, jwt){

  app.post('/observatory/api/shops/:id',

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

  async function (req, res) {
    var id = req.params.id;
    var Type = req.body.Type;
    var Name = req.body.Name;
    var Longitude = parseFloat(req.body.Longitude);
    var Latitude = parseFloat(req.body.Latitude);
    var Local_Part = req.body.Local_Part;
    var Domain_Id = parseInt(req.body.Domain_Id);
    var Withdrawn = parseInt(req.body.Withdrawn);
    var Street = req.body.Street;
    var Num = parseInt(req.body.Num);
    var Postal_Code = req.body.Postal_Code;
    var Region = req.body.Region;
    var Region = req.body.Phone_Num;
    var cnt = 0;
    var body = req.body;
    var data = {};
    //var tagsObj = tags.split(",");

    if(body.Type) cnt++;
		if(body.Name) cnt++;
		if(body.Longitude) cnt++;
		if(body.Latitude) cnt++;
		if(body.Local_Part) cnt++;
		if(body.Domain_Id) cnt++;
		if(body.Withdrawn) cnt++;
		if(body.Street) cnt++;
		if(body.Num) cnt++;
		if(body.Postal_Code) cnt++;
		if(body.Region) cnt++;
    if(body.Phone_Num) cnt++;

    if(cnt != 12 )
				return res.status(400).send( "400-Bad Request");

    data['Type'] = "'" + Type + "'";
    data['Name'] = "'" + Name + "'";
    data['Longitude'] = "'" + Longitude + "'";
    data['Latitude'] = "'" + Latitude + "'";
    data['Local_Part'] = "'" + Local_Part + "'";
    data['Domain_Id'] = "'" + Domain_Id + "'";
    data['Withdrawn'] = "'" + Withdrawn + "'";
    data['Street'] = "'" + Street + "'";
    data['Num'] = "'" + Num + "'";
    data['Postal_Code'] = "'" + Postal_Code + "'";
    data['Region'] = "'" + Region + "'";
    data['Phone_Num'] = "'" + Phone_Num + "'";

    sql = "UPDATE Store SET Name = '" + Name + "', Longtitude = "+ Longitude +" , Latitude = " + Latitude;
    sql += ", Phone_Num = '" + Phone_Num + "', Local_Part = '" + Local_Part + "', Domain_Id = " + Domain_Id;
    sql += ", Withdrawn = " + Withdrawn + "WHERE Store_Id = "+ id+";";
    console.log("query for PUT STORE:");
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
    })
    sql = "UPDATE Store_Address SET Street = '"+Street+"', Num = "+ Num+" , Postal_Code = "+Postal_Code+ ", Region = '" + Region+"' WHERE Store_Id = "+ id+";";
    console.log("query for PUT STORE_ADDRESS:");
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.status(203).send(JSON.stringify(data , null, 200));
    })
  });
}
