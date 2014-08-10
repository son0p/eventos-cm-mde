/**
* Procesotaller.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    alumno : {
      model: 'Persona'
    },
    taller : {
      model: 'Taller'
    },
    alumnoActivo : {
      type : 'boolean',
      defaultsTo : 'true'
    },
    fechaInscripcion : {
      type : 'date'
    },
    sesiones : {
      type : 'json'
    }
  }
};
