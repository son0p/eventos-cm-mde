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
      //sails.log.verbose(nodos);
      res.view('persona/registro', { nodos : nodos });
    }
  },
  create : function(req, res) {
    sails.log(req.body);
    Persona.create(req.body).populate('inscritoEnNodo').exec(function(err, persona){
      if (err) {
        /*
        {error: "E_VALIDATION", model: "Persona", summary: "1 attribute is invalid", status: 400, invalidAttributes: Object}
        {error: "E_UNKNOWN", summary: "Encountered an unexpected error", status: 500, raw: "MongoError: insertDocument :: caused by :: 11000 E11000 duplicate key error index: eventos_em.persona.$correo_1  dup key: { : "juan@gmail.com" }"} */
        sails.log.verbose(err);
//        JSON.stringify(e.invalidAttributes.correo,null,2))
        req.flash('message', 'Error en la autenticación');
        return res.send(err);
      }
      Nodo.findOne({nombre : req.body.nodos}).populate('inscritos').exec(function (err, nodo){
        nodo.inscritos.add(persona.id);
        nodo.save(sails.log.verbose);
        req.flash('message', 'Usted se ha registrado con exito!');
        //Log user in
        req.session.passport.user = persona.id;
        req.session.nombre = persona.nombre;
        req.session.authenticated = true;
        sails.log.verbose(req.session);
        return res.redirect('/taller');
      });
    });
  },
  // render the conocerte view
  conocerte: function(req, res, next) {
    // Find the user from the id passed in via params
    Persona.findOne(req.param('id')).populate('inscritoEnNodo').exec(function(err, persona) {
      if (err) return next(err);
      if (!persona) return next('User doesn\'t exist.');
      // res.send(persona);
      var nodos = res.locals.nodos;
      res.view({ nodos: nodos , persona : persona, id: req.param('id') });
    });
  },
    // render the edit view (e.g. /views/edit.ejs)
  edit: function(req, res, next) {

    // Find the user from the id passed in via params
    Persona.findOne(req.param('id')).populate('inscritoEnNodo').exec(function(err, persona) {
      if (err) return next(err);
      if (!persona) return next('User doesn\'t exist.');
      //res.send(persona);
      var nodos = res.locals.nodos;
      res.view({ nodos: nodos , persona : persona, id: req.param('id') });
    });
  },
  // process the info from edit view
  update: function(req, res, next) {
    sails.log.verbose(req.param('id'));
    sails.log.verbose(req.body);
    res.send(req.body);
    Persona.update(req.body.id, req.body).exec(function(err,upd) {
      sails.log.verbose(upd);
      if (err) {
        sails.log.verbose("No se logró actualizar");
        return;
      }
      sails.log.verbose("Actualizado");
    });

    // User.update(req.param('id'), userObj, function userUpdated(err) {
    //   if (err) {
    //     return res.redirect('/user/edit/' + req.param('id'));
    //   }

    //   res.redirect('/user/show/' + req.param('id'));
    // });
  }
};
