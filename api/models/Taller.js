/**
* Taller.js
*
* @description :: TODO: You might write a short summary of how this model wonrks and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema : true,
  attributes: {
    nombre : { type : 'STRING' },
    descripcion : { type : 'STRING' },
    requerimientos : { type : 'STRING' },
    publicar : {
      type : 'BOOLEAN',
      defaultsTo : 'true'
    },
    eventoInterno : {
      type : 'BOOLEAN',
      defaultsTo : 'false'
    },
    cuposDisponibles : {
      type : 'INTEGER',
      defaultsTo : '30'
      },
    lugar : { type : 'STRING' },
    fecha : { type : 'DATE' },
    hora : { type : 'STRING' },
    contacto : { type : 'STRING' },
    urlImagen : { type : 'STRING' },
    urlMemorias : { type : 'STRING' },
    tallerista : { type : 'STRING' }, // ¿Cómo un submodelo, nombre, teléfono, email ?
    /*
     comentarios : {
       collection : 'Comentario',
       via : 'ComentariosPreguntas'
     },
     */
    inscritos : {
      collection : 'Persona',
      via : 'inscritoEnTaller'
      }
  }
};
