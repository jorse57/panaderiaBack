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
    try {
      let params = req.allParams();
      let where = {};
      if (params.search) where.fechaVenta = params.search;
          let ventas = await Venta.find({ where }).sort('id ASC');

          UtilidadesController.returnRes(true, 'Ventas', res, ventas);
      } catch (error) {
          sails.log.debug(error);
          UtilidadesController.returnRes(false, 'error al obtner las Ventas', res);
      }
  },

  getByid: async function (req, res) {
      let params = req.allParams()
      Venta.find({ where: { id: params.id } }).then((pro) => {
          UtilidadesController.returnRes(true, 'Venta por id', res, pro[0]);
      });
  },

  crearVenta: async function (req, res) {
      let ven = req.allParams()
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
}