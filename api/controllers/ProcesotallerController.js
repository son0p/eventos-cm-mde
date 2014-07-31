/**
 * ProcesotallerController
 *
 * @description :: Server-side logic for managing procesotallers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// Para generar los horarios según la fecha de inicio, la fecha de finalización y la periodicidad https://github.com/c-trimm/moment-recur
// var moment = require('moment');
// require('moment-recur');

// var recurrence = moment().recur();
// recurrence.every(1, "weeks");
// var fechasClasesArray = recurrence.next(3);

var fechasClasesArray = [ '08/04/2014',
  '08/11/2014',
  '08/18/2014',
  '08/25/2014',
  '09/01/2014',
  '09/08/2014',
  '09/15/2014',
  '09/22/2014',
  '09/29/2014',
  '10/06/2014' ];

function fillSesiones (fechasClasesArray) {
  sesiones = [];
  fechasClasesArray.forEach(function (e, i) {
  sesiones[i] = { fecha : e , asistio : false, comentario : '' };
  });
  return sesiones;
};


module.exports = {
  //Utilizar beforeCreate para verificar que no se inscribe más de un taller igual para un persona
	activarProceso : function (req, res) {
    var sesiones = fillSesiones(fechasClasesArray);
    var procesoObj = {
      alumno : req.query.persona,
      taller : req.query.taller,
      sesiones : sesiones
    };
    Procesotaller.create(procesoObj).exec(function (err, proceso) {
      if(err) return res.send(err);
      return res.send(proceso);
    });
  }
};
