module.exports = {
	
	queries: function(con, distance, input, location,res, el){
		
		getAddress = function(input) {
			sql = "Select Store_Id,Region from Store_Address"
			con.query(sql, function(err, result) {
				if(err) throw err;
				choices = new Array(result.length)
				for(var i = 0; i< result.length; i++) choices[i] = result[i]['Region']
				options = {
        			scorer: distance.partial_ratio, 
        			limit: 0, 
        			cutoff: 70, 
        			unsorted: false 
				};
				addr = distance.extract(input, choices, options)
				console.log(addr)
				if(addr.length == 0) getkind(input, null);
				else getkind(input, addr[0][0])
				//console.log(res)
			})
		}
		getkind = function(input, region) {
			
			kind_map = {'Liquor Store': 'κάβα', 'Super Market':'σουπερ μαρκετ', 'Kiosk':'περίπτερο'}
			if(region) {
				sql = "Select Store_Id,Type,Name from Store where Store_Id in (" +
				"Select Store_Id from Store_Address where Region='" + region + "')";
			} else {
				sql = "Select Store_Id,Type,Name from Store"
			}
			
			con.query(sql, function(err, result) {
				if(err) throw err;
				console.log("Query result = ", result)
				choices = new Array(result.length)
				for(var i = 0; i<result.length; i++) choices[i] = kind_map[result[i]['Type']]
				options = {
        			scorer: distance.partial_ratio, 
        			limit: 0, 
        			cutoff: 70, 
        			unsorted: false 
				};
				types = distance.extract(input, choices, options)
				console.log("Types = ", types)
				if(types.length > 0) {
					var k = 0
					choices = new Array(types.length)
					for(var i = 0; i < result.length; i++) {
						if(kind_map[result[i]['Type']] == types[0][0]) {
							choices[k] = result[i]['Name']
							k += 1
						}
					}
				}
				else {
					choices = new Array(result.length)
					for(var i = 0; i < result.length; i++) choices[i] = result[i]['Name']
				}
				options = {
        			scorer: distance.partial_ratio, 
        			limit: 0, 
        			cutoff: 60, 
        			unsorted: false 
				};
				names = distance.extract(input, choices, options)
				console.log("Names = ", names)
				if(types.length != 0) {
						stores = new Array(types.length);
						for(var i = 0; i<types.length; i++) {
							stores[i] = result[types[i][2]]['Store_Id']
							//filterDrinks(input, stores);
						}
					}
					else {
						
						stores = new Array(result.length);
						for(var i = 0; i<result.length; i++) {
							stores[i] = result[i]['Store_Id']
							//filterDrinks(input, stores);
						}
					}
				if(names.length > 0) {
					tmp = new Array(names.length);
					var k = 0;
					for(var i = 0; i < result.length; i++) {
						for(var j = 0; j < names.length; j++) {
							if(result[i]['Name'] == names[j][0]) {
								tmp[k] = result[i]['Store_Id']
								k += 1
							}
						}
					}
					stores = stores.concat(tmp)	
				}
				
				console.log("Stores = ", stores)
				getDrinks(input, stores)
			})
		}
		
		getDrinks = function(input, store_ids) {
			stores = "(";
			for(var i = 0; i < store_ids.length; i++) {
				stores += store_ids[i];
				if(i != store_ids.length -1) stores += ",";
				else stores += ")";
			}
			sql = "Select * from Drinks where Store_Id in " + stores;
			con.query(sql, function(err, result) {
				if(err) throw err;
				//console.log(result)
				options = {
        			scorer: distance.partial_ratio, 
        			limit: 0, 
        			cutoff: 70, 
        			unsorted: false 
				};
				
				choices = new Array(result.length)
				for(var i = 0; i < result.length; i++) choices[i] = result[i]['Category']
				categories = distance.extract(input, choices, options)
				
				if(categories.length > 0) category = categories[0][0]
				else category = null
				
				choices = new Array(result.length)
				for(var i = 0; i < result.length; i++) choices[i] = result[i]['Tag']
				tags = distance.extract(input, choices, options);
				
				if(tags.length > 0) tag = tags[0][0]
				else tag = null
			
				choices = new Array(result.length)
				for(var i = 0; i < result.length; i++) choices[i] = result[i]['Name']
				options.cutoff = 50
				names = distance.extract(input, choices, options);
				console.log("Names are:", names)
				if(names.length > 0) {
					tmp = "('";
					for(var i = 0; i < names.length; i++) {
						tmp += names[i][0];
						if(i != names.length -1) tmp += "','";
						else tmp += "')";
					}
					names = tmp;	
				}
				else names = null;
				
				console.log(category)
				console.log(tag)
				console.log(names)
				
				final = []
				console.log("Getting ready to fix...")
				if(category == null && tag != null) weak(tag, names, final)
				else if(category == null && tag == null) final_fun(result)
				else fix(category, tag, names, final)
			})
		}
		fix = function(category, tag, names, final) {
				console.log("Fix");
				if(category == null || tag == null || names == null) fix2(category, tag, names, final)
				else {
				sql = "Select * from Drinks where Category='" +
				category + "'and Tag='" + tag + "'and Store_Id in (Select Store_Id from Store where Name in " + names +") ORDER BY PRICE"
				con.query(sql, function(err, result) {
					if(err) throw err;
					final = final.concat(result)
					fix2(category, tag,names, final)
				} )
				}
			}
		/* Category + Tag */
		fix2 = function(category, tag, names, final) {
			console.log("Fix2");
			if(category == null || tag == null) fix3(category, names, final)
			else {
			sql = "Select * from Drinks where Category='" +
				category + "'and Tag='" + tag + "' ORDER BY PRICE";
				con.query(sql, function(err, result) {
					if(err) throw err;
					final = final.concat(result)
					fix3(category, names, final)
				} )
			}
		}
		/* Category + Name */
		fix3 = function(category, names, final) {
			console.log("Fix3");
			if(category == null || names == null) fix_final(category, final)
			else {
			sql = "Select * from Drinks where Category='" +
				category + "'and Store_Id in (Select Store_Id from Store where Name in " + names +") ORDER BY PRICE"
			con.query(sql, function(err, result) {
					if(err) throw err;
					final = final.concat(result)
					fix_final(category, final)
				} )
			}
		}
		
		fix_final = function(category,final) {
			console.log("Fix final");
			if(category == null) final_fun(final)
			else {
				sql = "Select * from Drinks where Category='" +
				category + "' ORDER BY PRICE";
				con.query(sql, function(err, result) {
					if(err) throw err;
					final = final.concat(result)
					final_fun(final)
				} )
			}
		}
		weak = function(tag, names, final) {
			if(names == null) weak_final(tag, final)
			else sql = "Select * from Drinks where Tag='" +
				tag + "'and Store_Id in (Select Store_Id from Store where Name in " + names +") ORDER BY PRICE"
			console.log(tag)
			console.log(names)
			con.query(sql, function(err, result) {
				if(err) throw err;
				final = final.concat(result)
				console.log(result)
				weak_final(tag, final)
			})		
		}
		weak_final = function(tag, final) {
			sql = "Select * from Drinks where Tag='" + tag +"' ORDER BY PRICE";
			con.query(sql, function(err, result) {
				if(err) throw err;
				final = final.concat(result)
				final_fun(final)
			})		
		}
		final_fun = function(final) {
			//console.log("Final result = " ,final)
			console.log("final")
			if(location == null)
				console.log(final)
			else {
				lon = location.DisplayPosition.Longtitude
				lat = location.DisplayPosition.Latitude
				//lon = location.Longtitude
				//lat = location.DisplayPosition
				drink_ids = "("
				for(var i = 0; i < final.length; i++) {
					if(i != final.length -1)
						drink_ids += final[i]['Drink_Id']+",";
					else drink_ids += final[i]['Drink_Id']+")"
				}
				console.log(drink_ids)
				sql = "Select Longtitude, Latitude from Store where Store_Id in (Select Store_Id from Drinks where Drink_Id in " + drink_ids +")";
				con.query(sql, async function(err, result) {
					if(err) throw err;
					maps = require('./maps.js')
					ls = []
					console.log(result)
					for(var i = 0; i < result.length; i++) {
						dist = await maps.straightDistance(lat, result[i].Latitude, lon, result[i].Longtitude)
						console.log(dist)
						if(dist < 5000) {
							ls.push(final[i])
						}
					}
					final = ls
					console.log(final)
					el.getfinalResults(final, res, null)
				})


}
			el.getfinalResults(final, res, null)
		}
		getAddress(input);
		
	}
}
