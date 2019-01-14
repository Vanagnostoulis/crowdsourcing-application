module.exports = function (app,con){

	app.delete('/observatory/api/shops/:id', function(req,res){
		var id = req.params.id;
		/* ******************** ADMIN **************
		sql = "DELETE FROM Store WHERE  Store_Id= " + id+" ;";
		console.log("CASE ADMIN DELETE STORE");
		console.log(sql);
		con.query(sql, function (err, result) {
		  if (err) throw err; 
		  console.log(result);
		})
		sql = "DELETE FROM Store_Address WHERE  Store_Id= " + id+" ;";
		console.log("CASE ADMIN DELETE STORE");
		console.log(sql);
		con.query(sql, function (err, result) {
		  if (err) throw err; 
		  console.log(result);
		})
		*/ 

		// ******************** USER **************
		var status = 1;
		sql = "UPDATE Store Withdrawn = " + status + "WHERE  Store_Id= " + id+" ;";
		console.log("CASE USER IN DELETE STORE");
		console.log(sql);
		con.query(sql, function (err, result) {
		  if (err) throw err; 
		  console.log(result);
		})
		res.send(JSON.stringify({ message: 'ok'}));
	})		
}