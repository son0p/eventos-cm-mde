/**
 * NodoController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	getNodos : function(req, res, next) {
    Nodo.find().exec(function(err, nodos){
      var nodosArray = [];
      _.each(nodos, function(nodo){
        nodosArray.push(nodo.toJSON());
      });
      res.locals.nodos = nodosArray;
      next();
    });
  }
};
