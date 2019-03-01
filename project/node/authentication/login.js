module.exports = function(app, con, bcrypt) {
  /* post method -- request and respond */
  /* catch login submission */
  const cookieParser = require('cookie-parser');

  app.use(cookieParser());
  
  app.post('/login', function(req, res) {
    /* variables for login */

    username = req.body.uname; /* name = "uname" in javascript on some placeholder */
    password = req.body.psw;
	global.test = username
    mail_login = false;

    if (username.includes("@")) {
      mail_login = true;
      //to compare password that user supplies in the future
      var arr = username.split('@')
      var sql = "SELECT Password, Username FROM Users Where " +
        "Domain_Id = (Select Domain_Id from Email_Domains where Domain_Name = '" + arr[1] + "')" +
        "and Local_Part = '" + arr[0] + "'";
    } else {
      var sql = "SELECT Password FROM Users Where  Username = '" + username + "'";
    }

    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log(result[0])
      if (result[0] == null) {
        res.render('index', {
          authentication_failed: "Το όνομα χρήστη δεν ταιριάζει με το συνθηματικό.",
          password_mismatch: null,
          error_user_exist: null,
          error_fb_account_exist: null
        });
      } else {
        hash = result[0].Password
        bcrypt.compare(password, hash, function(err, doesMatch) {
          if (doesMatch) {
            if (mail_login) {
              username = result[0].Username;
              /*choose which coordinates to store at the cookie(ex. default users' coordinates).
              If the user wants to change them for a specific search you can change
              them inside the cookie too*/
              res.cookie("userData", {
                user: username,
                permission: 'user',
                coordinates: {
                  longitude: 0,
                  latitude: 0
                }
              }, {
                expire: 24 * 60 * 60 * 1000
              });
              res.redirect('/');
            } else {

              /*choose which coordinates to store at the cookie(ex. default users' coordinates).
              If the user wants to change them for a specific search you can change
              them inside the cookie too*/
              res.cookie("userData", {
                user: username,
                permission: 'user',
                coordinates: {
                  longitude: 0,
                  latitude: 0
                }
              }, {
                expire: 24 * 60 * 60 * 1000
              });
              res.redirect('/');
              console.log("The session has been authenticated: " + req.isAuthenticated());
            }
          } else {
            res.render('index', {
              authentication_failed: "Το όνομα χρήστη δεν ταιριάζει με το συνθηματικό.",
              password_mismatch: null,
              error_user_exist: null,
              error_fb_account_exist: null
            });
          }
        });

      }
      console.log("username checked.");

    });


    console.log("Entered to login");
    console.log("username: " + username);
    console.log("password: " + password);
    console.log(global.test)
  })
  
}
