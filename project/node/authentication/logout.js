module.exports = function(app) {
  /* post method -- request and respond */
  /* catch logout submission */
  const cookieParser = require('cookie-parser');

  app.use(cookieParser());

  app.get('/logout', function(req, res) {
    /* variables for login */
    console.log(req.cookies.userData.user + " has just logged out.")
    res.clearCookie("userData");
    res.render('index', {
      authentication_failed: null,
      password_mismatch: null,
      error_user_exist: null,
      error_fb_account_exist: null
    });
    console.log(global.test)
  })
}
