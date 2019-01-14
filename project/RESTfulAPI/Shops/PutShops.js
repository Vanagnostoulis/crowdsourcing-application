module.exports = function (app,con){

  app.post('/observatory/api/shops/:id', function (req, res) {
    var id = req.params.id;
    var name = req.body.name;
    // I NEED TO GET THE TYPE ALSO
    var storeAddress = req.body.addr;
    var storeNo = parseInt(req.body.no);
    var storePostal = parseInt(req.body.postal);
    var storeRegion = parseInt(req.body.region);
    var storeLng = parseInt(req.body.lng);
    var storeLat = parseInt(req.body.lat);
    var tags = req.body.tags;
    var tagsObj = tags.split(",");
    sql = "UPDATE Store SET Name = '"+name+"', Longtitude = "+ storeLng+" , Latitude = "+storeAddress+ "WHERE Store_Id = "+ id+";";
    console.log("query for PUT STORE:");
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err; 
      console.log(result);
    })
    sql = "UPDATE Store_Address SET Street = '"+storeAddress+"', Num = "+ storeNo+" , Postal_Code = "+storePostal+ ", Region = '" + storeRegion+"' WHERE Store_Id = "+ id+";";
    console.log("query for PUT STORE_ADDRESS:");
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err; 
      console.log(result);
    })
  });
}