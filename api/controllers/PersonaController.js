/**
 * PersonaController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	inscripcion : function(req, res) {
    res.view('persona/inscripcion');
  },
  registro : function(req, res) {
    res.view('persona/registro');
  },
  create : function(req, res) {
    sails.log.verbose(req.session.returnTo);
    Persona.create(req.body).exec(function(err, result){
      if (err) {
        return res.redirect('persona/registro');
      }
      return res.redirect(req.session.returnTo);
    });
  }
};
