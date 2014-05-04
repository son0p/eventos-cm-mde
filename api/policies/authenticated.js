module.exports = function(req, res, next) {
  if(req.isAuthenticated()){
    sails.log.verbose("Está autenticado");
    return next();
  }else{
    req.session.returnTo = req.url;
    return res.view('auth/login');
  }
};
