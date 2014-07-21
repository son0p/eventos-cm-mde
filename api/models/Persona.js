/**
* Persona.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema : true,
  attributes: {
    nombre: { type:'STRING'},
    // Roles son estudiante, adminstrador, superadministrador
    roles : {
      type: 'array',
      defaultsTo: 'estudiante'
    },
    telefonos: {
      type: 'STRING'
    },
    correo : {
      type: 'email',
      required: true,
      unique: true
    },
    institucionEducativa : { type : 'STRING' },
    inscritoEnTaller : {
      collection : 'Taller',
      via : 'inscritos',
      dominant : 'true'
    },
    inscritoEnNodo : {
      collection : 'Nodo',
      via : 'inscritos',
      dominant : 'true'
    },
    fechaNacimiento : {
      type : 'DATE'
    },
    estudiadoMusicaAntes : {
      type : 'BOOLEAN'
    },
    sabeTocarInstrumento : {
      type : 'BOOLEAN'
    },
    generosMusicales : {
      type : 'ARRAY'
    },
    instrumentoDePreferencia : {
      type : 'ARRAY'
    },
    sexo : {
      type : 'STRING',
      enum : ['Hombre','Mujer']
    }
  },
  /**
   * Enrolls a user in one or more courses.
   * @param  {Object}   options
   *            => courses {Array} list of course ids
   *            => id {Integer} id of the enrolling user
   * @param  {Function} cb

  inscribirEnNodo: function (persona, cb) {
    Persona.findOne(persona.id).exec(function (err, theUser) {
      if (err) return cb(err);
      if (!theUser) return cb(new Error('User not found.'));
      theUser.inscritoEnNodo.add(options.courses);
      theUser.save(cb);
    });
    }
  */
};
