/**
 * TallerController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
function prettyDate(dateString){
    var date = new Date(dateString);
    var d = date.getDate();
    var monthNames = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ];
    var m = monthNames[date.getMonth()];
    var y = date.getFullYear();
    return d+' '+m+' '+y;
}

module.exports = {
  getTalleres : function(req, res, next) {
    Taller.find().sort({ fecha: 'asc' }).exec(function(err, talleres){
      var talleresArray = [];
      _.each(talleres, function(taller){
        talleresArray.push(taller.toJSON());
      });
      res.locals.talleres = talleresArray;
      next();
    });
  },
  getTalleresActivos : function(req, res, next) {
    Taller.find({publicar: 'true'}).sort({ fecha: 'asc' }).exec(function(err, talleres){
      var talleresArray = [];
      _.each(talleres, function(taller){
        talleresArray.push(taller.toJSON());
      });
      res.locals.talleres = talleresArray;
      next();
    });
  },
	index : function(req, res) {
    sails.log.verbose(req.session);
    Taller.find().sort({ fecha: 'asc' }).exec(function(err, talleres) {
      _.each(talleres, function(taller) {
        var descripcion = taller.descripcion;
        sails.log.verbose(typeof taller.descripcion);
        if(_.isString(taller.descripcion)) taller.descripcion = descripcion.substr(0,150) + " ...";
        taller.fecha = prettyDate(taller.fecha);
      });
      //sails.log.verbose(talleres);
      res.view({talleres: talleres });
    });
  },
  find : function(req, res) {
    Taller.findOneById(req.param('id')).exec(function(err, taller) {
      taller.fecha = prettyDate(taller.fecha);
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
      requerimientos: req.param('requerimientos'),
      publicar : req.param('publicar'),
      eventoInterno : req.param('eventoInterno')
    };
    sails.log.verbose(TallerObj);
    Taller.create(TallerObj, function(err, taller){
      sails.log.verbose("taller creado: " + taller);
      if (err) {
        res.send({ type: 'error', message : 'Ocurrió un error creando el taller'});
      }
      taller.save(function(err, taller) {
        if (err) return next(err);
        return res.send({ type: 'success', message : 'El taller ha sido creado exitosamente'});
      });
    });
  },
  edit : function(req, res) {
    Taller.findOne(req.param('id')).exec(function (err, taller) {
      if (err) return res.send({ type: 'error', message : 'El taller no existe'});
      if (!taller) return res.send({ type: 'error', message : 'El taller no existe'});
      return res.view('taller/edit', { taller : taller, id : req.param('id') });
    });
  },
  edit_process : function(req, res) {
    sails.log.verbose(req.body.id);
    var TallerObj = {
      id: req.param('id'),
      nombre: req.param('nombre'),
      descripcion: req.param('descripcion'),
      lugar: req.param('lugar'),
      fecha: req.param('fecha'),
      fechaFinaliza: req.param('fechaFinaliza'),
      periodicidad: req.param('periodicidad'),
      hora: req.param('hora'),
      requerimientos: req.param('requerimientos'),
      publicar : req.param('publicar'),
      eventoInterno: req.param('eventoInterno')
    };
    sails.log.verbose(TallerObj);
    Taller.update(TallerObj.id, TallerObj).exec(function(err, upd){
      sails.log.verbose("taller editado: " + upd);
      if (err) {
        return res.send({ type: 'error', message : 'Error actualizando taller'});
      }
      res.send({ type: 'success', message : 'Taller actualizando exitosamente'});
    });
  },
  listadoInscritos : function(req, res) {
    Taller.findOneById(req.param('id')).populateAll().exec(function(err, taller) {
      if(err) return res.send(err);
      return res.view('taller/listado_inscritos_taller', {taller : taller});
    });
  }
};
