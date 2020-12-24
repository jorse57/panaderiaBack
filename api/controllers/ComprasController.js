/**
 * ComprasController
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

    let sqlFind = 'SELECT "nitProveedor", "numeroRecibo", "nombreProveedor", "fechaCompra", "fechaEntregaP"'
    sqlFind += ' from compras'
    sqlFind += ' group by "nitProveedor", "numeroRecibo", "nombreProveedor", "fechaCompra", "fechaEntregaP"'
    sqlFind += ' order by "fechaCompra" DESC'

    if (params.search) where.numeroRecibo = params.search;
    try {
      let comprasQuery = await sails.sendNativeQuery(sqlFind);
      let compras = comprasQuery.rows

      UtilidadesController.returnRes(true, 'Compras', res, compras);
    } catch (error) {
      sails.log.debug(error);
      UtilidadesController.returnRes(false, 'error al obtner los Compras', res);
    }
  },

  getByid: async function (req, res) {
    let params = req.allParams()
    Compra.find({ where: { id: params.id } }).then((pro) => {
      UtilidadesController.returnRes(true, 'Compra por id', res, pro[0]);
    });
  },
  getCompraIndividual: async function (req, res) {
    let params = req.allParams()
    params = params +""
    console.log("parametro--->", params)
    let sqlFindCompra = 'SELECT "nitProveedor", "numeroRecibo", "nombreProveedor", "fechaCompra", "fechaEntregaP"'
    sqlFindCompra += ' from compras'
    sqlFindCompra += ' WHERE "numeroRecibo" = '+ params.id
    sqlFindCompra += ' group by "numeroRecibo"'

    let infoProBD = await sails.sendNativeQuery(sqlFindCompra)
    let pro = infoProBD.rows;
    UtilidadesController.returnRes(true, 'Compra por numeroRecibo', res, pro[0]);
  },


  getByNumeroRecibo: async function (req, res) {
    let params = req.allParams()
    let pro = await Compra.find({ where: { numeroRecibo: params.numeroRecibo } })
    let sqlFind = 'SELECT "idProducto", "nombre"'
    sqlFind += ' FROM productos'
    sqlFind += ' where "idProducto" = '
    let totalCompra = 0;
    for (let i = 0; i < pro.length; i++) {
      let infoProQ = await sails.sendNativeQuery(sqlFind + pro[i].idProducto)
      let infoPro = infoProQ.rows;
      pro[i].idProd = infoPro[0].idProducto;
      pro[i].nombreProd = infoPro[0].nombre;
      totalCompra += pro[i].cantidad * pro[i].costo
    }
    pro[0].totalCompra = totalCompra;
    UtilidadesController.returnRes(true, 'Compra por numeroRecibo', res, pro);
  },

  crearCompra: async function (req, res) {
    let com = req.allParams()
    try {
      let resCom = await Compra.create(com)
      let resExis = await ProductosController.controlExistencias(com.idProducto, com.cantidad, "1")
      let resPrecio = await ProductosController.controlPrecio(com.idProducto, com.valor)
      UtilidadesController.returnRes(true, 'Compra creado', res);
    } catch (err) {
      sails.log.debug(err);
      UtilidadesController.returnRes(false, 'No se pudo crear el Compra', res);
    }
  },
  actualizarCompra: async function (req, res) {
    let com = req.allParams()
    let update = {
      nitProveedor: com.nitProveedor,
      nombreProveedor: com.nombreProveedor,
      idProducto: com.idProducto,
      cantidad: com.cantidad,
      costo: com.costo,
      valor: com.valor,
      numeroRecibo: com.numeroRecibo,
      fechaCompra: com.fechaCompra,
      fechaEntregaP: com.fechaEntregaP,

    }
    Producto.update({ id: com.id }, update).then(() => {
      UtilidadesController.returnRes(true, 'Producto actualizado', res);
    }).catch((err) => {
      sails.log.debug(err);
      UtilidadesController.returnRes(false, 'No se pudo actualizar el producto', res);
    });
  },
}