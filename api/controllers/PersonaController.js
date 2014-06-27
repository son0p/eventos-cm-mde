/**
 * PersonaController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
function prettyDate(dateString){
    var date = new Date(dateString);
    var d = date.getDate();
    var monthNames = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];
    var m = monthNames[date.getMonth()];
    var y = date.getFullYear();
    return d+' '+m+' '+y;
}

module.exports = {
  find : function(req, res) {
    Persona.find().populate("inscritoEnNodo").exec(function(err, personas) {
      _.each(personas, function(persona) {
        persona.createdAt = prettyDate(persona.createdAt);
      });
      res.view('persona/inscritos', {personas : personas});
    });
  },
  registro : function(req, res) {
    if(req.isAuthenticated()){
      Persona.findOne(req.session.passport.user).exec(function(err, persona){
        sails.log.verbose("Nombre : " + persona.nombre);
        req.session.nombre = persona.nombre;
        req.flash('message', 'Bienvenido a las casas de la música');

        if(!persona.fechaNacimiento) return res.redirect("/persona/conocerte/"+persona.id);

        res.redirect('/taller');
      });
    } else {
      var nodos = res.locals.nodos;
      //sails.log.verbose(nodos);
      res.view('persona/registro', { nodos : nodos });
    }
  },
  create : function(req, res) {
    sails.log.verbose(req.body);
    //sails.log.verbose(res.locals.nodos);
    //sails.log.verbose(req.body.nodos);
    var nodoSeleccionado = _.find(res.locals.nodos, { 'nombre' : req.body.nodos });
    sails.log.verbose(nodoSeleccionado.id);
    Persona.create(req.body).populate('inscritoEnNodo').exec(function(err, persona){
      if (err) {
        sails.log.verbose(err);
        req.flash('message', 'Error en la autenticación');
        return res.send(err);
      }
      persona.inscritoEnNodo.add(nodoSeleccionado.id);
      persona.save(sails.log.verbose);
      req.flash('message', 'Usted se ha registrado con exito!');
      //Log user in
      req.session.passport.user = persona.id;
      req.session.nombre = persona.nombre;
      req.session.authenticated = true;
      sails.log.verbose(req.session);

      // Envía correo para notificar registro exitoso
      nodemailer.send({
        name: 'Casas de Música - Medellín',
        from: 'casas@medellinvivelamusica.com',
        to: persona.correo,
        subject: 'Registro exitoso. ¡ Bienvenido a las Casas de Música de Medellín',
        messageHtml: "<h2>¡Gracias por diligenciar el formato de inscripción y animarte a vivir la Música con nosotros!</h2> <p>Tenemos una activa agenda de talleres y eventos que puedes seguir consultando <a href=\'http://mi.medellinvivelamusica.com/taller\'> aquí </a> <p>Estamos en una etapa de trabajo intenso para crear un lugar de encuento digital donde confluya la información sobre todas las actividades de las Casas de Música de Medellín </p> <p> Gracias por tu comprensión. </p>   "
      }, function(err, response){
        sails.log.verbose('nodemailer sent', err, response);
      });

      return res.send({ type: 'success', message : 'Usuario registrado exitosamente'});
      //}); //cerraba Nodo.findOne
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
    // ERROR ACTUALIZANDO ASSOCIATIONS
    // https://github.com/balderdashy/waterline/issues/290
    sails.log.verbose(req.params.all());
    sails.log.verbose(req.body);
    var nodoSeleccionado = _.find( res.locals.nodos, { 'nombre' : req.body.nodos });
    sails.log.verbose("VEREDE " + (nodoSeleccionado));

    var PersonaObj = {
      id : req.param('id'),
      nombre : req.param('nombre'),
      telefonos : req.param('telefonos'),
      institucionEducativa : req.param('institucionEducativa'),
      fechaNacimiento : req.param('fechaNacimiento'),
      estudiadoMusicaAntes : req.param('estudiadoMusicaAntes'),
      sabeTocarInstrumento : req.param('sabeTocarInstrumento'),
      generosMusicales : req.param('generosMusicales'),
      instrumentoDePreferencia : req.param('instrumentoDePreferencia')
      };
    Persona.findOne(req.param('id')).populate('inscritoEnNodo').exec(function(err,persona) {
      sails.log.verbose(persona);
      if (err) {
        sails.log.verbose("No se logró actualizar");
        return res.send(err);
      }
      if(!persona) return res.badRequest("Persona desconocida");

      _.assign(persona, PersonaObj);
      // VERIFICAR SI YA ESTÁ EN EL NODO O REMOVER ANTERIOR Y AGREGAR NUEVO
      // EN ESTE MOMENTO SOLO SE PUEDE AGREGAR UN NODO
      sails.log.verbose(Object.keys(persona.inscritoEnNodo));
      Object.keys(persona.inscritoEnNodo).forEach(function(v) {
        if(parseInt(v) == 0) persona.inscritoEnNodo.remove(persona.inscritoEnNodo[v].id);
        if(parseInt(v)) persona.inscritoEnNodo.remove(persona.inscritoEnNodo[v].id);
      });
      sails.log.verbose(nodoSeleccionado.id);
      persona.inscritoEnNodo.add(nodoSeleccionado.id);
      persona.save(sails.log.verbose);

      sails.log.verbose("Actualizado");
      return res.send({ type: 'success', message : 'Usuario actualizado exitosamente'});
    });

    // User.update(req.param('id'), userObj, function userUpdated(err) {
    //   if (err) {
    //     return res.redirect('/user/edit/' + req.param('id'));
    //   }

    //   res.redirect('/user/show/' + req.param('id'));
    // });
  }
};
