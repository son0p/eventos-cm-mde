/**
* Persona.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    nombre: { type:'STRING'},
    telefonos: { type: 'STRING'},
    correo : { type: 'STRING'},
    institucionEducativa : { type : 'STRING' },
    inscritoEn : {
      collection : 'Taller',
      via : 'inscritos',
      dominant : 'true'
    }
  },
  /**
   * Enrolls a user in one or more courses.
   * @param  {Object}   options
   *            => courses {Array} list of course ids
   *            => id {Integer} id of the enrolling user
   * @param  {Function} cb

  inscribir: function (options, cb) {
    Persona.findOne(options.id).exec(function (err, theUser) {
      if (err) return cb(err);
      if (!theUser) return cb(new Error('User not found.'));
      theUser.inscritoEn.add(options.courses);
      theUser.save(cb);
    });
    }
  */
};
