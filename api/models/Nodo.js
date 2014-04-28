/**
* Nodo.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema : true,
  attributes : {
    nombre    : {
      type : 'STRING',
      unique : true
    },
    direccion : { type : 'STRING' },
    barrio    : { type : 'STRING' },
    comuna    : { type : 'STRING' },
    telefono  : { type : 'STRING' },
    correo_electronico : { type : 'STRING' },
    nombre_encargado  : { type : 'STRING' },
    cupo_limite : {
      type : 'INTEGER',
      defaultsTo : '30'
    },
    inscritos : {
      collection : 'Persona',
      via : 'inscritoEnNodo'
    }
  }
};
