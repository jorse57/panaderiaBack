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
        if (params.search) where.numeroRecibo = params.search;
        try {
            let compras = await Compra.find({ where }).sort('id ASC');

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

    crearCompra: async function (req, res) {
        let com = req.allParams()
        Compra.create(com).then(() => {
            await ProductosController.agregarExistencias(com.idProducto, com.cantidad)
            UtilidadesController.returnRes(true, 'Compra creado', res);
        }).catch((err) => {
            sails.log.debug(err);
            UtilidadesController.returnRes(false, 'No se pudo crear el Compra', res);
        });
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