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
    Taller.findOneById(req.param('id')).done(function(err, taller) {
      res.view('taller/detalle',{taller: taller });
      });
    }
};
