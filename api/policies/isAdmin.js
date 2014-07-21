module.exports = function(req, res, next) {
  Persona.findOne(req.session.passport.user).exec(function(err, user){
    if(err) return('/');
    if(user.roles && user.roles[0] == 'admin'){
      sails.log.verbose("Es admin");
      return next();
    }else{
      req.session.returnTo = req.url;
      sails.log.verbose('No es administrador');
      return res.view('/');
    }
  });
};
