module.exports = {

	getfinalResults : function(result,res,req) {
		category='whisky';//px
			var count,result_json ,parser;
			if (req){
				count = parseInt(req.body.cnt);
				console.log(count)
				count +=10 ;
				result_json = req.body.res;
				console.log(count)
				if (req.cookies.userData){
					var usrnm = req.cookies.userData.user;
				}
				
			}
			else {
				//throw result;
				result_json= JSON.stringify(result);
				count = 10
				console.log("here",count)
			}
			result =JSON.parse(result_json);
			
			
			console.log(result.length)
			
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
					if(req){
						if (req.cookies.userData){
							res.send(h.header+list+h.midle0_more+usrnm+h.midle1+usrnm+h.midle2+result_json+h.midle3+count.toString()+h.midle4);
						}
						else{
							res.send(h.header_no_in+list+h.midle_no_in_more+result_json+h.midle3+count.toString()+h.midle4);
						}
					}
					else{
						res.send(h.header_no_in+list+h.midle_no_in_more+result_json+h.midle3+count.toString()+h.midle4);
					}
				}
				else{
					if (req){
						if (req.cookies.userData){
							res.send(h.header+list+h.midle0_no_more+usrnm+h.midle1+usrnm+h.midle2+result_json+h.midle3+count.toString()+h.midle4);
						}
						else{
							res.send(h.header_no_in+list+h.midle_no_in_no_more+result_json+h.midle3+count.toString()+h.midle4);
						}
					}
					else {
						res.send(h.header_no_in+list+h.midle_no_in_no_more+result_json+h.midle3+count.toString()+h.midle4);
					}
				
				}
			}
			/*res.render('results', {
				username : req.cookies.userData.user,
				res : result_json,
				count : count
            });
			console.log(result_json);*/

	}


}
