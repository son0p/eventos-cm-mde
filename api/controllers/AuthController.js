/**
 * AuthController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var passport = require('passport');

module.exports = {
	login: function(req, res) {
    //OJO, para que funcione el /login sin pasar por otro lado
    req.session.returnTo = '/';
    // TERMINA OJO
    res.view('auth/login');
  },
  process: function(req, res){
    passport.authenticate('local', function(err, user, info){
      if( (err) || (!user)) {
        sails.log.verbose(err);
        return res.redirect('/login');
        //return;
      }
      req.logIn(user, function(err){
        if(err) {
          res.redirect('/login');
          sails.log.verbose(err);
        }
        //req.session.returnTo es asignada en api/policies/authenticated.js
        req.session.returnTo = '/';
        return res.redirect(req.session.returnTo);
      });
      sails.log.verbose(req.session);
    })(req, res);
  },
  logout: function(req, res){
    sails.log.verbose(req.originalUrl);
    req.session.returnTo = req.baseUrl;
    req.logout();
    req.session.nombre = "";
    req.flash('message','Estás afuera');
    res.redirect('/taller');
  },
  faq : function(req, res){
    res.view('auth/faq');
  }
};
