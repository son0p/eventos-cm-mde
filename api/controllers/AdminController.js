/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req, res) {
    Persona.find().populateAll().exec(function(err, personas) {
      return res.view('admin/index',{ personas : personas});
    });
  },
  talleres : function(req, res) {
    Taller.find({publicar : true}).populateAll().exec(function(err, talleres) {
      return res.view('admin/talleres', {talleres : talleres});
    });
  },
  personas : function(req, res) {
    Persona.find().populateAll().exec(function(err, personas) {
      return res.view('admin/personas', { personas : personas });
    });
  },
  nodos : function(req, res) {
    Nodo.find().populateAll().exec(function(err, nodos) {
      return res.view('admin/nodos', {nodos : nodos});
    });
  }
};
