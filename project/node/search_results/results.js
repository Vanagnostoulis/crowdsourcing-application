module.exports = function(app, con) {
	app.get('/results', function(req, res) {
		category='whisky';
		var sql = "select Category,Price,Description,Tag,Ml,Name,Drink_Id,Store_Id from Drinks where  Category = '" + category + "' order by Price" ;
		con.query(sql, function(err, result) {
      		if (err) throw err;
			var count,result_json ,parser;
			if (req.body.cnt){
				count = req.body.cnt;
				count +=10 ;
				result_json = req.body.res;
				console.log("no test")
			}
			else {
				result_json= JSON.stringify(result);
				count = 10
			}
			result =JSON.parse(result_json);
			console.log(result[0])
		    console.log(result.length)
			var usrnm = req.cookies.userData.user;
			h=require('./htmlcode.js');
			var list ='';
			var start = '<li onclick="fundetails(';
			var cont0 = ')"> <a href="#"><img src="img/'+category+'.jpg" style="float:left; width:150px; height:130px; padding: 8px 8px 15px"></img><p class="product">';
			var cont1 = '</p><p class="description">';
			var cont2 = '</p><p class="price">';
			var end = '€</p></a></li>';
			var i,num_blocks=result.length,result_i;
			if (num_blocks==0){
				res.send(h.header_no_res+h.midle0_no_more+usrnm+h.midle1+usrnm+h.midle2+result_json+h.midle3+count.toString()+h.midle4);
			}
			else{
				if (num_blocks<count){
					count = num_blocks;
				}
				for (i = 0; i < count; i++){
					if (result[i].Name){
						if (result[i].Tag){
							list +=start+i.toString()+cont0+result[i].Category+' '+result[i].Tag+cont1+result[i].Name+'.'+cont2+result[i].Price+end
						}
						else {
							list +=start+i.toString()+cont0+result[i].Category+cont1+result[i].Name+'.'+cont2+result[i].Price+end
						}
					}
					else{
						if (result[i].Tag){
							list +=start+i.toString()+cont0+result[i].Category+' '+result[i].Tag+cont1+' '+cont2+result[i].Price+end
						}
						else {
							list +=start+i.toString()+cont0+result[i].Category+cont1+' '+cont2+result[i].Price+end
						}
					}
				}
				// I need MORE button 
				if (num_blocks>count){

					res.send(h.header+list+h.midle0_more+usrnm+h.midle1+usrnm+h.midle2+result_json+h.midle3+count.toString()+h.midle4);
				}
				else{
					res.send(h.header+list+h.midle0_no_more+usrnm+h.midle1+usrnm+h.midle2+result_json+h.midle3+count.toString()+h.midle4);
				}

			}
			/*res.render('results', {
				username : req.cookies.userData.user,
				res : result_json,
				count : count
            });
			console.log(result_json);*/
		});
	}) ;


}
