/**
 * ProductosController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const UtilidadesController = require('./UtilidadesController');


const self = module.exports = {
  get: async function (req, res) {
    let params = req.allParams();
    let where = {};
    if (params.search) where.nombre = params.search;
    try {
      let productos = await Producto.find({ where }).sort('id ASC');

      UtilidadesController.returnRes(true, 'Productos', res, productos);
    } catch (error) {
      sails.log.debug(error);
      UtilidadesController.returnRes(false, 'error al obtner los productos', res);
    }
  },

  getByid: async function (req, res) {
    let params = req.allParams()
    Producto.find({ where: { id: params.id } }).then((pro) => {
      UtilidadesController.returnRes(true, 'Producto por id', res, pro[0]);
    });
  },

  getByidOrByName: async function (req, res) {
    let params = req.allParams()
    let number = params.search * 1;
    let find = {
      or: [
        { id: number ? number : undefined },
        { nombre: params.search }
      ]
    };

    Producto.find(find).then((pro) => {
      if (pro[0]) {
        UtilidadesController.returnRes(true, 'Producto por id', res, pro[0]);
      } else {
        UtilidadesController.returnRes(false, 'Producto no encontrado', res);
      }
    });
  },

  crearProducto: async function (req, res) {
    let pro = req.allParams()
    Producto.create(pro).then(() => {
      UtilidadesController.returnRes(true, 'Producto creado', res);
    }).catch((err) => {
      sails.log.debug(err);
      UtilidadesController.returnRes(false, 'No se pudo crear el producto', res);
    });
  },

  actualizarProducto: async function (req, res) {
    let pro = req.allParams()
    let update = {
      nombre: pro.nombre,
      precioVenta: pro.precioVenta,
      tipoProducto: pro.tipoProducto,
      estado: pro.estado,
      descripcion: pro.descripcion,
      unidadMedida: pro.unidadMedida,
      stockMin: pro.stockMin,
      stockMax: pro.stockMax,
      fechaCaducidad: pro.fechaCaducidad,
    }
    Producto.update({ id: pro.id }, update).then(() => {
      UtilidadesController.returnRes(true, 'Producto actualizado', res);
    }).catch((err) => {
      sails.log.debug(err);
      UtilidadesController.returnRes(false, 'No se pudo actualizar el producto', res);
    });
  },

  controlExistencias: async function (idProd, nuevasExistencias, tipo) {
    return new Promise(function (res, rej) {
      Producto.find({ where: { id: idProd } }).then((pro) => {
        pro = pro[0]
        let totalExistencias ;
        if (tipo == 1) {
          totalExistencias = pro.existencias + nuevasExistencias;
        } else {
          totalExistencias = pro.existencias - nuevasExistencias;
        }
        let update = {
          existencias: totalExistencias
        }
        Producto.update({ id: pro.id }, update).then(() => {
          res('updated existencias')
        }).catch(rej)
      });
    })
  }
}