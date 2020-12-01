/**
 * VentasController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const ProductosController = require('./ProductosController');
const UtilidadesController = require('./UtilidadesController');

const self = module.exports = {
  get: async function (req, res) {
    let params = req.allParams();
    let where = {};

    let sqlFind = 'SELECT "numeroRecibo", "fechaVenta", SUM("precio" * "cantidad") as total'
    sqlFind += ' from ventas'
    sqlFind += ' group by "numeroRecibo", "fechaVenta"'
    sqlFind += ' order by "fechaVenta" DESC'

    if (params.search) where.numeroRecibo = params.search;
    try {
      let ventasQuery = await sails.sendNativeQuery(sqlFind);
      let ventas = ventasQuery.rows
      UtilidadesController.returnRes(true, 'Ventas', res, ventas);
    } catch (error) {
      sails.log.debug(error);
      UtilidadesController.returnRes(false, 'error al obtner los Ventas', res);
    }
  },
  
  getByid: async function (req, res) {
    let params = req.allParams()
    Venta.find({ where: { id: params.id } }).then((pro) => {
      UtilidadesController.returnRes(true, 'Venta por id', res, pro[0]);
    });
  },
  getByNumeroRecibo: async function (req, res) {
    let params = req.allParams()
    let pro = await Venta.find({ where: { numeroRecibo: params.numeroRecibo } })
    let sqlFind = 'SELECT "idProducto", "nombre"'
    sqlFind += ' FROM productos'
    sqlFind += ' where "idProducto" = '
    let totalVenta = 0;
    for (let i = 0; i < pro.length; i++) {
        let infoProQ = await sails.sendNativeQuery(sqlFind + pro[i].idProducto)
        let infoPro = infoProQ.rows;
        pro[i].idProd = infoPro[0].idProducto;
        pro[i].nombreProd = infoPro[0].nombre;
        totalVenta += pro[i].cantidad * pro[i].precio
    }
    pro[0].totalVenta = totalVenta;
    UtilidadesController.returnRes(true, 'Venta por numeroRecibo', res, pro);
},

  crearVenta: async function (req, res) {
    let ven = req.allParams();
    Venta.create(ven).then(() => {
      ProductosController.controlExistencias(ven.idProducto, ven.cantidad, "2").then(re => {
        UtilidadesController.returnRes(true, 'Venta creado', res);
      }).catch((err) => {
        sails.log.debug(err);
        UtilidadesController.returnRes(false, 'No se pudo crear el Venta', res);
      });
    }).catch((err) => {
      sails.log.debug(err);
      UtilidadesController.returnRes(false, 'No se pudo crear el Venta', res);
    });
  },
  actualizarVenta: async function (req, res) {
    let ven = req.allParams()
    let update = {
      fechaVenta: ven.fechaVenta,
      idProducto: ven.idProducto,
      cantidad: ven.cantidad,
      precio: ven.precio,
      idCliente: ven.idCliente,
      idUsuario: ven.idUsuario,
    }
    Venta.update({ id: ven.id }, update).then(() => {
      UtilidadesController.returnRes(true, 'Venta actualizada', res);
    }).catch((err) => {
      sails.log.debug(err);
      UtilidadesController.returnRes(false, 'No se pudo actualizar la venta', res);
    });
  },

  get_NumeroRecibo: async function (req, res) {
    let sql = 'SELECT "numeroRecibo"'
    sql += ' FROM ventas'
    sql += ' ORDER BY "numeroRecibo" DESC LIMIT 1'

    let ultimaVentaQu = await sails.sendNativeQuery(sql);
    let ultimaVenta = ultimaVentaQu.rows;
    if (ultimaVenta && ultimaVenta[0]) {
      UtilidadesController.returnRes(true, 'numero recibo', res, ultimaVenta[0].numeroRecibo + 1);
    } else {
      UtilidadesController.returnRes(true, 'numero recibo', res, 1);
    }
  }
}