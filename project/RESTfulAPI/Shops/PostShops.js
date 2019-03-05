var VerifyToken = require('../VerifyToken.js');

module.exports = function (app,con, maps, jwt){

  app.post('/observatory/api/shops',
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
    var Type = req.body.Type;
    var Name = req.body.Name;
    var Longitude = parseFloat(req.body.Longitude);
    var Latitude = parseFloat(req.body.Latitude);
    var Local_Part = req.body.Local_Part;
    var Phone_Num = req.body.Phone_Num;
    var Domain_Id = parseInt(req.body.Domain_Id);
    var Withdrawn = parseInt(req.body.Withdrawn);
    var Store_Id = parseInt(req.body.Store_Id);
    var Street = req.body.Street;
    var Num = parseInt(req.body.Num);
    var Postal_Code = req.body.Postal_Code;
    var Region = req.body.Region;
    var flag = false;
    var body = req.body;
    var data = {};
    var Store_Adress = '';



      var sql = "INSERT INTO Store_Address (Store_Id,";
      if(body.Street){
        sql += "Street";
        flag = true;
      }


      if(body.Num){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += "Num";
        Store_Adress += Num;

      }
      if(body.Postal_Code){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += "Postal_Code";
        Store_Adress += " " + Postal_Code;
      }
      if(body.Region){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += "Region";
        Store_Adress += " " + Region;
      }
      console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE" + Store_Adress);
      sql += ") VALUES ((Select LAST_INSERT_ID())," ;
      flag = false;

      if(body.Street){
        sql += "'" + Street + "'";
        flag = true;
        data['Street'] = "'" + Street + "'";
      }

      if(body.Num){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += Num;
        data['Num'] = "'" + Num + "'";
      }

      if(body.Postal_Code){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += "'" + Postal_Code + "'";
        data['Postal_Code'] = "'" + Postal_Code + "'";
      }
      if(body.Region){
        if(flag)
          sql += ",";
        else
          flag = true;
        sql += "'" + Region + "'";
        data['Region'] = "'" + Region + "'";
      }

      sql2 = "INSERT INTO Store (Longtitude, Latitude";
      flag = false;
      if(!body.Longitude && !body.Latitude){
        var location = await maps.getCoordinates(Store_Adress);
        Longitude = location.DisplayPosition.Longitude;
        Latitude = location.DisplayPosition.Latitude;
      }
      data['Longitude'] = "'" + Longitude + "'";
      data['Latitude'] = "'" + Latitude + "'";

      if(body.Type){
        flag = true;
        sql2 += ",Type";
        data['Type'] = "'" + Type + "'";
      }

      if(body.Phone_Num){
        if(flag)
          sql2 += ",";
        else
          flag = true;
        sql2 += "Phone_Num";
        data['Phone_Num'] = "'" + Phone_Num + "'";
      }
      if(body.Local_Part){
        if(flag)
          sql2 += ",";
        else
          flag = true;
        sql2 += Local_Part;
        data['Local_Part'] = "'" + Local_Part + "'";
      }

      if(body.Domain_Id){
        if(flag)
          sql2 += ",";
        else
          flag = true;
        sql2 += Domain_Id;
        data['Domain_Id'] = "'" + Domain_Id + "'";
      }

      sql2 += ") VALUES (" ;
      flag = false;

      sql2 += Longitude + ",";
      sql2 += Latitude ;


      if(body.Type){
        flag = true;
        sql2 += ",'" + Type + "'";
      }

      if(body.Phone_Num){
        if(flag)
          sql2 += ",";
        else
          flag = true;
        sql2 += "'" + Phone_Num + "'";;
      }
      if(body.Local_Part){
        if(flag)
          sql2 += ",";
        else
          flag = true;
        sql2 += "'" + Local_Part + "'";
      }

      if(body.Domain_Id){
        if(flag)
          sql2 += ",";
        else
          flag = true;
        sql2 += "'" + Domain_Id + "'";
      }

      sql2 += ");";

      console.log("query for ADDDDD:");
      console.log(sql2);
      con.query(sql2, function (err, result) {
        if(err)
          console.log("MYSQL ERROR:" + err);
        else
          console.log(result);
        console.log(result);
      })

      sql += ");";
      console.log("query for ADDDDD:");
      console.log(sql);
      con.query(sql, function (err, result) {
        if(err)
          console.log("MYSQL ERROR:" + err);
        else
          console.log(result);

        console.log(result);
        res.status(203).send( JSON.stringify(data , null, 200));
      })
  });
}


//
// sql = "BEGIN; INSERT INTO Store (Name, Longtitude, Latitude) VALUES('"+ name +"', "+ storeLng+", "+storeLat+
// ");INSERT INTO Store_Address (Store_Id, Street, Num, Postal_Code, Region) VALUES(LAST_INSERT_ID(),'"+ storeAddress+
// "', "+ storeNo+", "+storePostal+" ,' "+region+"');COMMIT;"
// console.log("query for POST SORE:");
// console.log(sql);
