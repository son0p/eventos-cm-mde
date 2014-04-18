/**
 * TallerController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	index : function(req, res) {
    Taller.find().done(function(err, talleres) {
      sails.log.verbose(talleres);
      res.view({talleres: talleres });
    });
  },
  find : function(req, res) {
    sails.log.verbose(req.param('id'));
    Taller.findOneById(req.param('id')).done(function(err, taller) {
      sails.log.verbose(taller);
      res.view('taller/detalle',{taller: taller });
      });
    },
  inscripcion: function(req, res) {
    res.view('taller/inscripcion');
    }
};
