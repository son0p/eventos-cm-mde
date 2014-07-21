/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req, res) {
    Persona.find().populateAll().exec(function(err, personas) {
      return res.view('persona/admin/index',{ personas : personas});
    });
  },
  talleres : function(req, res) {
    Taller.find().populate("inscritos").exec(function(err, talleres) {
      return res.view('persona/admin/talleres', {talleres : talleres});
    });
  },
  personas : function(req, res) {
    Persona.find().populateAll().exec(function(err, personas) {
      return res.view('persona/admin/personas', { personas : personas });
    });
  },
  nodos : function(req, res) {
    Nodo.find().populate("inscritos").exec(function(err, nodos) {
      return res.view('persona/admin/nodos', {nodos : nodos});
    });
  }
};
