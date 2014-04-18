var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user[0].id);
});

passport.deserializeUser(function(correo, done) {
  Persona.findByCorreo(correo, function(err, user){
    console.log(user);
    done(err, user);
    });
});

passport.use(new LocalStrategy(function(correo, telefonos, done) {
  Persona.findByCorreo(correo).done(function(err, user) {
    if(err) { return done(null, err);}
    if(!user || user.length < 1) { return done(null, false, { message: 'Correo electrónico incorrecto' }); }
    if(telefonos != user[0].telefonos) { return done(null, false, { message: 'Teléfono inválido' }); }
    return done(null, user);
  });
}));

module.exports = {
  express: {
    customMiddleware: function(app) {
      console.log('express middleware for passport');
      app.use(passport.initialize());
      app.use(passport.session());
    }
  }
};
