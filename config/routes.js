/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/
  //TipodeMetodpoHTTP/RUTA/ruta: elcontrollerusado.elnombredelmetodo
  'GET /usuario/crearAdmin': 'UsuariosController.crearAdmin',
  'GET /usuario/:id': 'UsuariosController.getByid',
  'GET /usuario/clientes': 'UsuariosController.getClientes',
  'GET /usuario': 'UsuariosController.get',
  'POST /usuario': 'UsuariosController.crearUsuario',
  'PUT /usuario': 'UsuariosController.actualizarUsuario',
  'GET /usuario/login': 'UsuariosController.quienEstaEnSesion',
  'POST /usuario/login': 'UsuariosController.postLogin',
  'POST /sendEmailForward': 'UsuariosController.sendEmailForward',
  'POST /cambiarContrasena': 'UsuariosController.cambiarContrasena',
  'POST /cambiarPass': 'UsuariosController.cambiarPass',


  'GET /producto': 'ProductosController.get',
  'GET /producto/:id': 'ProductosController.getByid',
  'GET /producto/searchIdOrName/:search': 'ProductosController.getByidOrByName',
  'GET /producto/search/:search': 'ProductosController.get',
  'POST /producto': 'ProductosController.crearProducto',
  'PUT /producto': 'ProductosController.actualizarProducto',
  'POST /producto/validarExistencias': 'ProductosController.validarExistenciasProd',
  'GET /producto/getProductoStockMin': 'ProductosController.getProductoStockMin',

  'GET /compra': 'ComprasController.get',
  'GET /compra/:id': 'ComprasController.getByid',
  'GET /compra/recibo/:numeroRecibo': 'ComprasController.getByNumeroRecibo',
  'POST /compra': 'ComprasController.crearCompra',

  'GET /venta': 'VentasController.get',
  'GET /venta/:id': 'VentasController.getByid',
  'GET /venta/searchClienteIdOrName/:search': 'VentasController.getClienteByidOrByName',
  'GET /venta/recibo/:numeroRecibo': 'VentasController.getByNumeroRecibo',
  'POST /venta': 'VentasController.crearVenta',
  'GET /venta/numeroRecibo': 'VentasController.get_NumeroRecibo',


  'GET /sendEmail': 'UtilidadesController.sendEmail'
};
