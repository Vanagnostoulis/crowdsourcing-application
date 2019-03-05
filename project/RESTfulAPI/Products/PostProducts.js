var VerifyToken = require('../VerifyToken.js');

module.exports = function (app,con, maps, jwt){

  app.post('/observatory/api/products',
  function (req, res, next) {
    var flag = false;
    var token = req.headers['x-observatory-auth'];
    if (!token)
      return res.status(401).send( "401-Not Authorized");

    sql = "Select * from Blacklist Where Token = " +"'" + token + "'";
    con.query(sql, function (err, result) {
    if(err)
      throw err;
    if(result.length != 0 )
      flag = true;
   } );
   if(flag)
    return res.status(403).send( "403-Forbidden");

    jwt.verify(token, 'pame ligo', function(err, decoded) {
      if (err)
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

      // if everything good, save to request for use in other routes
      req.username = decoded.username;
    });
      console.log("NEXTTTTTT");
      return next();

  }

  , async function (req, res, next) {
    console.log("ELA");
    var Category = req.body.Category;
    var Name = req.body.Name;
    var Description = req.body.Description;
    var Price = parseFloat(req.body.Price);
    var Ml = parseInt(req.body.Ml);
    var Tag = req.body.Tag;
    var Store_Adress = req.body.Store_Adress;
    var flag = false;
    var body = req.body;

    // ****** retrieve valuss from description *****
    // remove all spaces to be sure for inputs
    //var temp = Description.replace(/ /g,'');

    // if (parseInt(temp.substring(temp.search('%')-2,100)) > 0)
    //   // case of 20%
    //   var alcohol = parseInt(temp.substring(temp.search('%')-2,100));
    // else
    //   // case of 5%
    //   var alcohol = parseInt(temp.substring(temp.search('%')-1,100));
    //
    // if (parseInt(temp.substring(temp.search('ml')-3,100)) > 0)
    //   // case of 750ml
    //   var ml = parseInt(temp.substring(temp.search('ml')-3,100));
    // else
    //   // case of 75ml
    //   var ml = parseInt(temp.substring(temp.search('ml')-2,100));

    //var tagsObj = tags.split(",");

    //find store id to put in db
    var location = await maps.getCoordinates(Store_Adress);
    var Store_Id = -1;
    sql = "Select Store_Id from Store Where Longtitude = " + location.DisplayPosition.Longitude + " AND Latitude = " + location.DisplayPosition.Latitude + ";"
    console.log("query to get Store ID:");
    console.log(sql);
    con.query(sql, function (err, row) {
      if (err) throw err
      if(row.length != 0){
        //res.status(200).send("No store found");
        Store_Id  = row[0].Store_Id;
      }
      else{
        console.log("ELAAAAAAAAa");
        res.status(204).send( "204-No store found");
      }

      console.log("STORE ID 1: ");
      console.log(Store_Id);
    })
    //wait 20 ms to take the storeId from above query
    setTimeout(function(){
      var data = {};
      console.log("STORE ID 2: ");
      console.log(Store_Id);
      if(Store_Id == -1)
        return;
      sql = "INSERT INTO Drinks (";
      if(body.Category){
        sql += "Category";
        flag = true;
      }

      if(Store_Id > -1){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += "Store_Id";
      }

      if(body.Description){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += "Description";
      }
      if(body.Name){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += "Name";
      }
      if(body.Price){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += "Price";
      }
      if(body.Ml){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += "Ml";
      }
      if(body.Tag){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += "Tag";
      }

      sql += ") VALUES (" ;

      flag = false;
      if(body.Category){
        sql += "'" + Category + "'";
        flag = true;
        data['Category'] = "'"+ Category + "'";
      }

      if(Store_Id > -1){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += Store_Id;
        data['Store_Id'] = "'"+ Store_Id + "'";
      }

      if(body.Description){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += "'" + Description + "'";
        data['Description'] = "'"+ Description +"'";
      }
      if(body.Name){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += "'" + Name + "'";
        data['Name'] = "'"+ Name +"'";
      }
      if(body.Price){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += Price;
        data['Price'] = "'"+ Price +"'";
      }
      if(body.Ml){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += Ml;
        data['Ml'] = "'"+ Ml +"'";
      }
      if(body.Tag){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += "'" + Tag + "'";
        data['Tag'] = "'"+ Tag +"'";
      }

      sql += ");";

      console.log("query for ADDDDD:");
      console.log(sql);
      con.query(sql, function (err, result) {
        //if (err) throw err;
        if(err) {
          res.status(204).send( "204-No store found");
        //console.log(result);

      }
      else
          res.status(203).send( JSON.stringify(data , null, 200));
      })
    },20);
  });
}
