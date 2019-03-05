module.exports = function(app,con) {
  app.post('/details', function(req, res) {
    //console.log(req.body.res);
    var data = JSON.parse(req.body.res);
    console.log(data.Category);
    var sql1 = "select Type,Name,Longtitude,Latitude,Phone_Num  from Store where  Store_Id = " + data.Store_Id.toString() +";"
    con.query(sql1, function(err, result1) {
		if (err) throw err;
		console.log(result1[0])
		result1 = result1[0]
		var sql2 = "select Street,Num,Postal_Code,Region from Store_Address where Store_Id =" + data.Store_Id.toString()+";"
		con.query(sql2, function(err,result2){
			if (err) throw err;
			console.log(result2[0])
			result2 = result2[0]
			if (req.cookies.userData){
				res.render('details', {
				  category : data.Category,
				  tag : data.Tag,
				  name : data.Name,
				  ml : data.Ml,
				  price : data.Price,
				  description : data.Description,
				  street: result2.Street,
				  num: result2.Num,
				  postal_code : result2.Postal_Code,
				  region : result2.Region,
				  type : result1.Type,
				  store_name : result1.Name ,
				  lon : result1.Longtitude,
				  lat : result1.Latitude,
				  phone : result1.Phone_Num,
				  username : req.cookies.userData.user
				});
			}
			else{
				res.render('details_no', {
				  category : data.Category,
				  tag : data.Tag,
				  name : data.Name,
				  ml : data.Ml,
				  price : data.Price,
				  description : data.Description,
				  street: result2.Street,
				  num: result2.Num,
				  postal_code : result2.Postal_Code,
				  region : result2.Region,
				  type : result1.Type,
				  store_name : result1.Name ,
				  lon : result1.Longtitude,
				  lat : result1.Latitude,
				  phone : result1.Phone_Num,
				});
			}
			
		});
    });
  });

}
