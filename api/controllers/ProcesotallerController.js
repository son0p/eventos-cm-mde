/**
 * ProcesotallerController
 *
 * @description :: Server-side logic for managing procesotallers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// Para generar los horarios según la fecha de inicio, la fecha de finalización y la periodicidad https://github.com/c-trimm/moment-recur
var moment = require('moment');
require('moment-recur');


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
    var procesoObj = {
      alumno : req.query.persona,
      taller : req.query.taller
      //sesiones : sesiones // Hasta acá no hemos creado las sesiones
    };
    Taller.findOneById(procesoObj.taller).then(function(taller) {
      async.waterfall([
        function creaSesiones(callback) {
          sails.log.verbose(taller.fecha);
          sails.log.verbose(taller.fechaFinaliza);
          var recurrence = moment().recur( {
            start : taller.fecha,
            end : taller.fechaFinaliza
          }); // Crea un objecto de recurrencia entre startDate y endDate

          recurrence.every(1, "weeks"); // Establece la recurrencia cada semana -> tiene que ver con taller.periodicidad TODO
          var nClases = recurrence.end.diff(recurrence.start, 'weeks'); // A partir de la fecha de finalización y la de inicio se establece el número de sesiones
          var fechasClasesArray = recurrence.next(nClases, 'L');
          sesiones = fillSesiones(fechasClasesArray); // Crea el objeto sesiones
          procesoObj.sesiones = sesiones;
          callback(null, procesoObj);
        },
        function verificaNoExistePro (proceso, callback) {
          Procesotaller.find({alumno : proceso.alumno , taller : proceso.taller}).then( function(proc) {
            sails.log.verbose(proc.length);
            callback(null, proceso, proc.length);
          });
        },
        function crearProceso(proceso, proc, callback) {

          var procesoObj = {
            alumno : proceso.alumno,
            taller : proceso.taller,
            sesiones : proceso.sesiones
          };

          if(proc == 0) {
            Procesotaller.create(procesoObj).then(function (proceso) {
              callback(null, proceso);
            }).catch(function(error) {
              callback(error);
            });
          } else {
            callback("ya está inscrito");
          }
        }

      ], function finalizCreacionProceso(err, proceso) {
        if( err ) {
          return res.send(err);
        }
        return res.send(proceso);
      });
    }).catch(function(error) {
      res.send(error);
    });
  }
};
