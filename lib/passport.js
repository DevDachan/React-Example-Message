var db = require('./db.js');

module.exports = function (app) {

  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;

  app.use(passport.initialize());
  app.use(passport.session());

  router.post('/user_check',
    passport.authenticate('local', {
      successRedirect: '/user/main',
      failureRedirect: '/',
      failureFlash: true,
      successFlash: true
    }));



  passport.serializeUser(function (user, done) {
    console.log(user);
      done(null, user);
  });

  passport.deserializeUser(function (id, done) {
    console.log(id);
    if(typeof id === 'string' ){
    db.query(`SELECT * FROM user WHERE id=?`,[id],function(error,user){
      done(null, user[0]);
    });
  }
  else{
    done(null,id);
  }
  });
//----------------- google 로그인 방법 만들기 -----------------------------

passport.use(new LocalStrategy({
          nameField: 'id',
          emailField: 'email'
      },
      function (name, email, done) {
        user = {
          email: email,
          name: name
        };
        return done(null, user, { message: 'Welcome.'});
  }
));
  return passport;
}
