/**
 * Routes
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {


  // Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, etc. depending on your
  // default view engine) your home page.
  //
  // (Alternatively, remove this and add an `index.html` file in your `assets` directory)
  '/': ['NodoController.getNodos','PersonaController.registro'],
  '/persona/create': ['NodoController.getNodos','PersonaController.create'],
  '/persona/registro': ['NodoController.getNodos','PersonaController.registro'],
  '/persona/edit/:id': ['NodoController.getNodos','PersonaController.edit'],
  '/persona/conocerte/:id': ['NodoController.getNodos','PersonaController.conocerte'],
  '/persona/update': ['NodoController.getNodos','PersonaController.update'],
  'get /persona/:id/inscribirEnTaller' : ['TallerController.getTalleresActivos', 'PersonaController.render_inscribirEnTaller'],
  'post /persona/:id/inscribirEnTaller' : ['TallerController.getTalleresActivos', 'PersonaController.inscribirEnTaller'],

    // Custom routes here...
  'get /taller/create': 'TallerController.create',
  'post /taller/create': 'TallerController.create_process',
  'get /taller/edit/:id': 'TallerController.edit',
  'post /taller/edit': 'TallerController.edit_process',
  'get /taller/:id': 'TallerController.find',
  'get /taller/:id/listadoInscritos': 'TallerController.listadoInscritos',
  // {
  //   controller : 'taller',
  //   action : 'find'
  // }
  'post /taller/:id': 'TallerController.inscripcion',
  // { controller : 'taller',
  //   action : 'inscripcion'
  // }

  'get /login' : 'AuthController.login',
  'post /login' : 'AuthController.process',
  'get /logout' : 'AuthController.logout',
  '/faq' : 'AuthController.faq',

  '/admin' : ['TallerController.getTalleres','NodoController.getNodos','AdminController.index'],
  '/admin/personas' : ['TallerController.getTalleresActivos','NodoController.getNodos','AdminController.personas'],
  '/admin/talleres' : ['PersonaController.getPersonas','NodoController.getNodos','AdminController.talleres'],
  '/admin/nodos' : ['TallerController.getTalleresActivos','PersonaController.getPersonas','AdminController.nodos']
  // If a request to a URL doesn't match any of the custom routes above, it is matched
  // against Sails route blueprints.  See `config/blueprints.js` for configuration options
  // and examples.

};
