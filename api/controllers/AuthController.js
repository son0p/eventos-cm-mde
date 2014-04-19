/**
 * AuthController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var passport = require('passport');

module.exports = {
	login: function(req, res) {
    res.view('auth/login');
  },
  process: function(req, res){
    passport.authenticate('local', function(err, user, info){
      if( (err) || (!user)) {
        return res.redirect('/login');
        //return;
      }
      req.logIn(user, function(err){
        if(err) res.redirect('/login');
        //req.session.returnTo es asignada en api/policies/authenticated.js
        return res.redirect(req.session.returnTo);
      });
    })(req, res);
  },
  logout: function(req, res){
    sails.log.verbose(req.originalUrl);
    req.session.returnTo = req.baseUrl;
    req.logout();
    res.send('logout successful');
  }
};
