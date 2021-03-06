module.exports = function(app, con, bcrypt) {
  app.post('/register', function(req, res) {
    /* variables for register */
    email = req.body.email;
    password = req.body.pass_reg;
    repeat = req.body.repass_reg;
    username = req.body.reg_uname;

    if (password != repeat) {
      res.render('index', {
        authentication_failed: null,
        password_mismatch: "Error password mismatch",
        error_user_exist: null,
        error_fb_account_exist: null
      });
    } else {
      var sql = ""

      splitemail = email.split('@');

      sql = "INSERT IGNORE INTO Email_Domains (Domain_Name) VALUES ('" + splitemail[1] + "')"
      con.query(sql, function(err, result) {
        if (err) throw err;
      })

      sql = "Select Domain_Id from Email_Domains where Domain_Name = '" + splitemail[1] + "'";
      con.query(sql, function(err, result) {
        if (err) throw err;
        var domainid = result[0].Domain_Id;
        sql = "select exists(select * from Users where Local_Part = '" +
          splitemail[0] + "' and Domain_Id = " + domainid + ")";

        con.query(sql, function(err, result) {
          if (err) throw err;

          exists = result[0]["exists(select * from Users where Local_Part = '" +
            splitemail[0] + "' and Domain_Id = " + domainid + ")"
          ]

          if (exists) {
            res.render('index', {
              authentication_failed: null,
              password_mismatch: null,
              error_user_exist: "Φαίνεται πως κάποιος χρήστης χρησιμοποιεί το ίδιο e-mail.",
              error_fb_account_exist: null
            })
          } else {
            /* if email duplicate do something */
            bcrypt.hash(password, 10, function(err, bcryptedPassword) {
              if (err) throw err;
              var hash = bcryptedPassword;

              sql = "Insert into Users (Username, Password, Local_Part, Domain_Id) values ('" +
                username + "','" + hash + "','" + splitemail[0] + "'," + domainid + ")"

              con.query(sql, function(err, result) {
                if (err) throw err;
                console.log("User inserted");

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
                res.render('user', {
                  username: username,
				lat: null,
				lon: null,
				state: null,
				region: null,
				street: null,
				num: null,
				pcode: null
                });
              });
            });
          }
        });
      });

    }

    console.log("Entered to register");
    console.log(username); /* print */
    console.log(password);
    console.log(repeat);
    console.log(email);

  })

}
