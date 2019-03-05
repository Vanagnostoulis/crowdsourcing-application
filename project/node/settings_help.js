module.exports = function(app,con) {
	
	app.get('/settings', function(req,res) {
		username = req.cookies.userData.user;
		console.log("Username:" , username);
		sql = "Select Points from Users where Username='" + username + "'";
		con.query(sql, function(err,result) {
    		if (err) throw err;
    		console.log(result[0]);
    		points = result[0]['Points'];
    		res.render('settings', {
				username: username,
				points: points
			})
        })  	
	
   })

	app.post('/save', function(req,res) {
		username = req.body.reg_uname;
		console.log(username);
		prev_uname = req.cookies.userData.user;
		if (username !== prev_uname) {
			sql = "Update Users set Username= '"+username+"' where Username = '" + prev_uname +"'";
        	con.query(sql, function(err,result) {
        	if(err) throw err;
        	console.log("Username changed");
        	res.clearCookie("userData");
        	res.cookie("userData", {
				user: username,
				permission: 'user',
				coordinates: {
				longitude: 0,
				latitude: 0
				}
				}, {
				  expire: 24 * 60 * 60 * 1000
			});
			res.redirect('/');
			})
		}
		else {
			console.log("Im here");
			res.redirect('/');
		}
	})
	
}
