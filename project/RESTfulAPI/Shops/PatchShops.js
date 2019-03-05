module.exports = function (app,con, jwt){

	app.patch('/observatory/api/shops/:id',

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
		var cnt = 0;
		var body = req.body;
		var flag = false;
		var data = {}
		//var tagsObj = tags.split(",");

		if(body.Type) cnt++;
		if(body.Name) cnt++;
		if(body.Longitude) cnt++;
		if(body.Latitude) cnt++;
		if(body.Local_Part) cnt++;
		if(body.Domain_Id) cnt++;
		if(body.Withdrawn) cnt++;
		if(body.Street){
			flag = true;
			cnt++;
		 }
		if(body.Num){
			flag = true;
			cnt++;
		}
		if(body.Postal_Code){
			flag = true;
			cnt++;
		}
		if(body.Region){
			flag = true;
			cnt++;
		}

		if(cnt != 1 )
				return res.status(400).send( "400-Bad Request");

		if(flag){
			sql = "UPDATE Store_Adress SET ";

			if(body.Street){
				sql += "Street = '"
				sql += Street;
				sql += "'";
			}
			if(body.Num){
				sql += "Num = ";
				sql += Num;
			}
			if(body.Postal_Code){
				sql += "Postal_Code = '";
				sql += Postal_Code;
				sql += "'";
			}
			if(body.Region){
				sql += "Region = '";
				sql += Region;
				sql += "'";
			}

			sql += " WHERE Store_Id = " + id+ ";";
		}
		else{
			sql = "UPDATE Store SET ";

			if(body.Name){
				sql += "Name = '"
				sql += Name;
				sql += "'";
			}
			if(body.Longitude){
				sql += "Longtitude = ";
				sql += Longitude;
			}
			if(body.Latitude){
				sql += "Latitude = ";
				sql += Latitude;
			}
			if(body.Phone_Num){
				sql += "Phone_Num = '";
				sql += Phone_Num;
				sql += "'";
			}
			if(body.Local_Part){
				sql += "Local_Part = '";
				sql += Local_Part;
				sql += "'";
			}
			if(body.Domain_Id){
				sql += "Domain_Id = ";
				sql += Domain_Id;
			}
			if(body.Withdrawn){
				sql += "Withdrawn = ";
				sql += Withdrawn;
			}

			sql += " WHERE Store_Id = " + id+ ";";
		}

		console.log("Patch Shop:");
		console.log(sql);
		con.query(sql, function (err, result) {
			if(err)
				console.log("MYSQL ERROR:" + err);
			else
				console.log(result);
			res.status(203).send(JSON.stringify(data , null, 200));
		})
		sql = "SELECT * FROM Store WHERE Store_Id = " + id + ";";
		con.query(sql,function(err, result){

			    data['Type'] = "'" + result[0].Type + "'";
			    data['Name'] = "'" + result[0].Name + "'";
					data['Phone_Num'] = "'" + result[0].Phone_Num + "'";
			    data['Longitude'] = "'" + result[0].Longitude + "'";
			    data['Latitude'] = "'" + result[0].Latitude + "'";
			    data['Local_Part'] = "'" + result[0].Local_Part + "'";
			    data['Domain_Id'] = "'" + result[0].Domain_Id + "'";
			    data['Withdrawn'] = "'" + result[0].Withdrawn + "'";

		});
		sql = "SELECT * FROM Store_Address WHERE Store_Id =  " + id + ";";
		con.query(sql, function(err, result){
			data['Street'] = "'" + result[0].Street + "'";
			data['Num'] = "'" + result[0].Num + "'";
			data['Postal_Code'] = "'" + result[0].Postal_Code + "'";
			data['Region'] = "'" + result[0].Region + "'";
		});
	})
}
