/**
 * PersonaController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
  find : function(req, res) {
    Persona.find().populate("inscritoEnNodo").exec(function(err, personas) {
      res.view('persona/inscritos', {personas : personas});
    });
  },
  registro : function(req, res) {
    if(req.isAuthenticated()){
      Persona.findOne(req.session.passport.user).exec(function(err, persona){
        sails.log.verbose("Nombre : " + persona.nombre);
        req.session.nombre = persona.nombre;
        req.flash('message', 'Bienvenido a las casas de la música');
        res.redirect('/taller');
      });
    } else {
      var nodos = res.locals.nodos;
      sails.log.verbose(nodos);
      res.view('persona/registro', { nodos : nodos });
    }
  },
  create : function(req, res) {
    Persona.create(req.body).populate('inscritoEnNodo').exec(function(err, persona){
      if (err) {
        /*
        {error: "E_VALIDATION", model: "Persona", summary: "1 attribute is invalid", status: 400, invalidAttributes: Object}
        {error: "E_UNKNOWN", summary: "Encountered an unexpected error", status: 500, raw: "MongoError: insertDocument :: caused by :: 11000 E11000 duplicate key error index: eventos_em.persona.$correo_1  dup key: { : "juan@gmail.com" }"} */
        sails.log.verbose(err.invalidAttributes.correo, null, 2);
//        JSON.stringify(e.invalidAttributes.correo,null,2))
        var campos = [''];
        req.flash('message', 'Error en la autenticación');
        return res.send(err.invalidAttributes);
      }
      Nodo.findOne({nombre : req.body.nodos}).populate('inscritos').exec(function (err, nodo){
        nodo.inscritos.add(persona.id);
        nodo.save(sails.log.verbose);
        req.flash('message', 'Usted se ha registrado con exito!');
        return res.redirect('taller');
      });
      //Log user in
      req.session.passport.user = persona.id;
      req.session.nombre = persona.nombre;
      req.session.authenticated = true;
      sails.log.verbose(req.session);

    });
  }
};
