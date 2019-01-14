module.exports = function (app,con){

  app.post('/observatory/api/shops', function (req, res) {
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

    sql = "BEGIN; INSERT INTO Store (Name, Longtitude, Latitude) VALUES('"+ name +"', "+ storeLng+", "+storeLat+
    ");INSERT INTO Store_Address (Store_Id, Street, Num, Postal_Code, Region) VALUES(LAST_INSERT_ID(),'"+ storeAddress+
    "', "+ storeNo+", "+storePostal+" ,' "+region+"');COMMIT;"
    console.log("query for POST SORE:");
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err; 
      console.log(result);
    })
  });
}