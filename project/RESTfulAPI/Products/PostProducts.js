module.exports = function (app,con){

  app.post('/observatory/api/products', function (req, res) {
    var name = req.body.name;
    var description = req.body.dscr;
    var category = req.body.ctgry;
    var tags = req.body.tags;
    var price = parseInt(req.body.prc);   
    var finDate = req.body.finDate;
    var storeAddress = req.body.addr;
    var storeNo = parseInt(req.body.no);
    var storePostal = parseInt(req.body.postal);
    var currDate =  new Date().toISOString().slice(0, 10).replace('T', ' ');

    // ****** retrieve valuss from description *****
    // remove all spaces to be sure for inputs 
    var temp = description.replace(/ /g,'');
    var alcohol = parseInt(temp.substring(temp.search('%')-2,100));

    if (parseInt(temp.substring(temp.search('%')-2,100)) > 0)
      // case of 20%
      var alcohol = parseInt(temp.substring(temp.search('%')-2,100));
    else
      // case of 5%
      var alcohol = parseInt(temp.substring(temp.search('%')-1,100));

    if (parseInt(temp.substring(temp.search('ml')-3,100)) > 0)
      // case of 750ml
      var ml = parseInt(temp.substring(temp.search('ml')-3,100));
    else
      // case of 75ml
      var ml = parseInt(temp.substring(temp.search('ml')-2,100));

    var tagsObj = tags.split(",");

    //find store id to put in db
    var storeId;
    sql = "Select * from Store_Address Where Street = '" + storeAddress + "' AND Num = " + storeNo + " AND Postal_Code = " + storePostal + ";";
    console.log("query for Store ID:");
    console.log(sql);
    con.query(sql, function (err, row) {
      if (err) throw err; 
      storeId  = row[0].Store_Id;
      console.log("STORE ID 1: ");
      console.log(storeId);
    })
    //wait 20 ms to take the storeId from above query
    setTimeout(function(){
      console.log("STORE ID 2: ");
      console.log(storeId);
      sql = "INSERT INTO Drinks (Type,Marka,Price, Store_Id, Start_Day, Finish_Day, Alcohol,Ml) VALUES ( '" +
                   category + "','" + name + "', " + price + ","+ storeId +",'" + currDate +"','" +
                   finDate +"'," + alcohol+ "," + ml +");";
      console.log("query for ADDDDD:");
      console.log(sql);
      con.query(sql, function (err, result) {
        if (err) throw err; 
        console.log(result);
      })
    },20);
  });
}