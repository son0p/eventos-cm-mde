var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  sails.log.verbose("user: " + user[0].id);
  try {
    done(null, user[0].id);
  } catch (e) {
    sails.log.verbose(e);
  }
});

passport.deserializeUser(function(correo, done) {
  Persona.findByCorreo(correo, function(err, user){
    done(err, user);
    });
});

passport.use(new LocalStrategy(function(correo, telefonos, done) {
  Persona.findByCorreo(correo).exec(function(err, user) {
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
