/**
 * TallerController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	index : function(req, res) {
    sails.log.verbose(req.session);
    Taller.find().exec(function(err, talleres) {
      _.each(talleres, function(taller) {
        var descripcion = taller.descripcion;
        sails.log.verbose(typeof taller.descripcion);
        if(_.isString(taller.descripcion)) taller.descripcion = descripcion.substr(0,150) + " ...";
      });
      //sails.log.verbose(talleres);
      res.view({talleres: talleres });
    });
  },
  find : function(req, res) {
    Taller.findOneById(req.param('id')).exec(function(err, taller) {
      res.view('taller/detalle',{taller: taller });
      });
  },
  inscripcion : function(req, res) {
    sails.log.verbose(req.body);
    sails.log.verbose(Taller.findOne(req.params.id));
    Persona.findOne(req.session.passport.user).populate('inscritoEn').exec(function(err, persona){
      if (err) { res.send('error'); return; }
      var yaInscrito = false;
      var maxTalleres = false;
      persona.inscritoEn.forEanch(function (taller, indice) {
        sails.log.verbose("Entra for each " + indice + ": " + taller.id + " | " + req.params.id);
        if(taller.id == req.params.id) { yaInscrito = true; } // mandar mensaje que ya está inscrito
        if(indice == 5) { maxTalleres = true; } // mandar mensaje que alcanzo cupo máximo
      });
      if (!yaInscrito) {
        persona.inscritoEn.add(req.params.id);
        persona.save(sails.log.verbose);
      }
      sails.log.verbose(req.session.passport.user);
      // ¿Cómo pasar la información del taller acá?
      res.view('/taller/'+req.params.id);
    });
  },
  create : function(req, res) {
    res.view('taller/create');
  },
  create_process : function(req, res) {
    var TallerObj = {
      nombre: req.param('nombre'),
      descripcion: req.param('descripcion'),
      lugar: req.param('lugar'),
      fecha: req.param('fecha'),
      hora: req.param('hora'),
      requerimientos: req.param('requerimientos')
    };
    sails.log.verbose(TallerObj);
    Taller.create(TallerObj, function(err, taller){
      sails.log.verbose("taller creado: " + taller);
      if (err) {
        res.send(err);
      }
      taller.save(function(err, taller) {
        if (err) return next(err);
        return res.redirect('/taller');
      });
    });
  }
};
