module.exports = function(app, results) {
	app.post('/more',function (req,res){
		results.getfinalResults(results,res,req)});

	app.get('/more',function (req,res){
		results.getfinalResults(results,res,req)});
}
