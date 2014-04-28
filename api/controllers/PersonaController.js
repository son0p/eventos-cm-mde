/**
 * PersonaController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	// inscripcion : function(req, res) {
  //   sails.log.verbose(req.body);
  //   Persona.findOne(req.session.passport.user).populate('inscritoEn').exec(function(err, persona){
  //     if (err) { res.send('error'); return; }
  //     var yaInscrito = false;
  //     persona.inscritoEn.forEach(function (taller, indice) {
  //       sails.log.verbose("Entra for each " + indice + ": " + taller.id + " | " + req.params.id);
  //       if(taller.id == req.params.id) { yaInscrito = true; }
  //     });
  //     if (!yaInscrito) {
  //       persona.inscritoEn.add(req.params.id);
  //       persona.save(sails.log.verbose);
  //     }
  //     sails.log.verbose(req.session.passport.user);
  //     // ¿Cómo pasar la información del taller acá?
  //     res.redirect('/taller/'+req.params.id);
  //   });
  // },
  registro : function(req, res) {
    var nodos = res.locals.nodos;
    sails.log.verbose(nodos);
    res.view('persona/registro', { nodos : nodos });
  },
  create : function(req, res) {
    sails.log.verbose(req.body.nodos);
    // REGISTRAR PRIMERO LA PERSONA PARA LUEGO INSCRIBIRLA EN UN NODO
    Nodo.findOne({nombre : req.body.nodos}).populate('inscritos').exec(function (err, nodo){
      sails.log.verbose(nodo);
      nodo.inscritos.add(req.body.id);
      nodo.save(sails.log.verbose);
    });
    sails.log.verbose(req.body);
    res.send(req.body);
    // Persona.create(req.body).exec(function(err, persona){
    //   if (err) {
    //     return res.redirect('persona/registro');
    //   }
    //   Log user in
    //   req.session.passport.user = persona.id;
    //   req.session.authenticated = true;
    //   sails.log.verbose(req.session);
    //   return res.redirect(req.session.returnTo);
    // });
  }
};
