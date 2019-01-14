module.exports = function (app,con){

	app.delete('/observatory/api/products/:id', function(req,res){
		var id = req.params.id;
		/* ******************** ADMIN **************
		sql = "DELETE FROM Drinks WHERE  Drink_Id= " + id+" ;";
		console.log("CASE ADMIN DELETE");
		console.log(sql);
		con.query(sql, function (err, result) {
		  if (err) throw err; 
		  console.log(result);
		})
		*/ 

		// ******************** USER **************
		var status = 1;
		sql = "UPDATE Drinks SET Withdrawn = " + status + "WHERE  Drink_Id= " + id+" ;";
		console.log("CASE USER IN DELETE");
		console.log(sql);
		con.query(sql, function (err, result) {
		  if (err) throw err; 
		  console.log(result);
		})
		res.send(JSON.stringify({ message: 'ok'}));
		
	})
}