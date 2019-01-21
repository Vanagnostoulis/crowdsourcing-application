module.exports = function(app) {
  /* post method -- request and respond */
  /* catch logout submission */
  const cookieParser = require('cookie-parser');

  app.use(cookieParser());

  app.post('/logout', function(req, res) {
    /* variables for login */
    console.logout(req.cookies.userData.user + " has just logged out.")
    res.clearCookie("userData");
    res.render('index', {
      authentication_failed: null,
      password_mismatch: null,
      error_user_exist: null
    });
  })
}
