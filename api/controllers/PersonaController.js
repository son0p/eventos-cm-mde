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

        // var emailTemplate = res.render('email/email.ejs', {user: persona}, function(err, list){

        //   nodemailer.send({
        //     name: 'Casas de Música - Medellín',//persona.nombre,
        //     from: 'casas@medellinvivelamusica.com',
        //     to: persona.correo,
        //     subject: 'Registro exitoso. ¡ Bienvenido a las Casas de Música de Medellín',
        //     messageHtml: list
        //   }, function(err, response){
        //     sails.log.debug('nodemailer sent', err, response);
        //   });
        //   res.send(200, persona);

        // });

        nodemailer.send({
          name: 'Casas de Música - Medellín',
          from: 'casas@medellinvivelamusica.com',
          to: persona.correo,
          subject: 'Registro exitoso. ¡ Bienvenido a las Casas de Música de Medellín',
          messageHtml: "<h2>¡Gracias por diligenciar el formato de inscripción y animarte a vivir la Música con nosotros!</h2> <p>Tenemos una activa agenda de talleres y eventos que puedes seguir consultando <a href=\'http://mi.medellinvivelamusica.com/taller\'> aquí </a> <p>Estamos en una etapa de trabajo intenso para crear un lugar de encuento digital donde confluya la información sobre todas las actividades de las Casas de Música de Medellín </p> <p> Gracias por tu comprensión. </p>   "
        }, function(err, response){
          sails.log.verbose('nodemailer sent', err, response);
        });

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
    Persona.update(req.body.id, req.body).populate('inscritoEnNodo').exec(function(err,upd) {
      sails.log.verbose(upd);
      Nodo.findOne({nombre : req.body.nodos}).populate('inscritos').exec(function (err, nodo){

        // ESTA SALIENDO UN ERROR ACÁ, SOLUCIONARLO RÁPIDO
        nodo.inscritos.add(req.body.id);
        nodo.save(sails.log.verbose);
      });

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
