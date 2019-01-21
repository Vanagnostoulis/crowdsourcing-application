/*Given a free form text(e.g Νικηταρά 22 Αιγάλεω)
  returns an object location = {Longitude: , Latitude}
  It works only for greek searching text.
*/

/*PROSOXHHHHHHHHHHHHHHHHH

Gia na doulepsei swsta prepei na to xrhsimopoihsete
me polu sygkekrimeno tropo.
Auto sumbainei dioiti sthn javascript uparxoun polla asynxrona calls
kai se autes ti periptwseis auth h sunarthsh (logw tou request pou ginetai),
sou gyrnaei to apotelesma se akurh stigmh, enw esu mporei na to exeis
xrhsimopoihsei hdh.

PWS NA TO XRHSIMOPOIHSW???:

Arxika prepei na to kaneis require:
const a = require('./node/getCoordinates.js');

An theleis na to kaleseis mesa apo mia sunarthsh prepei na thn theseis
prwta ws async. An px eisai sto app.get('/', authenticationMiddleware,  function (req, res))
kai sto function thes na thn xrhsimopoihseis prepei mprosta ap to function na baleis async
dhladh app.get('/', authenticationMiddleware, async function (req, res) ).
(PANTA H SYNARTHSH AP THN OPOIA KALEITAI PREPEI NA NAI  async)
Epeita gia na kaleseis thn sunarthsh grafeis:

  var location = await a.data.getCoordinates('Νικηταρά 22 Αιγάλεω')
kai pleon exeis to location = {Longitude: , Latitude} pou htheles.

Proteinw meta apo auto na allajeis to cookie tou client wste
na mporeis na jereis se kathe request pou kanei, thn topothesia pou exei
epilejei. Gia na to kaneis auto prepei na antikatasthseis to palio cookie
kai na allajeis to antikeimeno coordinates. Ayto ginetai opws parakatw:

  var  username = req.cookies.userData.user;
  var   permission = req.cookies.userData.permission;
  res.cookie("userData", {user: username, permission: permission, coordinates: {longitude: location.Longitude , latitude: location.Latitude}}, {expire : 24 * 60 * 60 * 1000 }, {overwrite: true});

*/

var fromAddress = {

  getCoordinates: async function(freeTextAddress) {
    const request = require('request-promise');

    text = freeTextAddress.replace(/\s/g, "+");
    text = encodeURI(text);

    path = 'https://geocoder.api.here.com/6.2/geocode.json?app_id=qoxFJl1Vm1Boet7IWwE5&app_code=yCui6cYlQonbB6GDN01VFA&searchtext=' + text;
    var location;
    await request({
        url: path,
        json: true
      })
      .then(function(body) {
        location = body.Response.View[0].Result[0].Location.DisplayPosition;
        console.log(location);

      })
      .catch(function(err) {
        if (err) {
          return console.log(err);
        }
      })
    return location;
  }
}

exports.data = fromAddress;
