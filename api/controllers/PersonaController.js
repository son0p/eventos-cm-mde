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
    if(req.isAuthenticated()) res.redirect('/taller');
    var nodos = res.locals.nodos;
    sails.log.verbose(nodos);
    res.view('persona/registro', { nodos : nodos });
  },
  create : function(req, res) {
    Persona.create(req.body).populate('inscritoEnNodo').exec(function(err, persona){
      if (err) {
        return res.send(err);
      }
      Nodo.findOne({nombre : req.body.nodos}).populate('inscritos').exec(function (err, nodo){
        nodo.inscritos.add(persona.id);
        nodo.save(sails.log.verbose);
        req.flash('message', 'Usted se ha registrado con exito!');
        return res.redirect('taller');
      });
      //Log user in
      req.session.passport.user = persona.id;
      req.session.authenticated = true;
      sails.log.verbose(req.session);

    });
  }
};
