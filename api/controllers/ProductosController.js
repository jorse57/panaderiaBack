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
    let find = {};
    if (number) {
      find = { id: number ? number : undefined }
    } else {
      find = { nombre: params.search }
    }

    // console.log('find', JSON.stringify(find))

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
        let totalExistencias;
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
  },
  controlPrecio: async function (idProd, nuevoPrecio) {
    return new Promise(function (res, rej) {
      Producto.find({ where: { id: idProd } }).then((pro) => {
        pro = pro[0]
        console.log("Prodcto", pro);
        console.log("nuevo precio", nuevoPrecio);
        let update = {
          precioVenta: nuevoPrecio
        }
        Producto.update({ id: pro.id }, update).then((resBD) => {
          res('updated precio')
          console.log(resBD);
        }).catch(rej)
      });
    })
  },

  validarExistenciasProd: async function (req, res) {
    let params = req.allParams()
    if (params.productos && params.productos.length) {
      let invalidos = [];
      for (let i = 0; i < params.productos.length; i++) {
        let prod = await Producto.find({ where: { id: params.productos[i].id } })
        prod = prod[0]
        if ((prod.existencias - params.productos[i].cantidad) < 0) {
          invalidos.push({ id: prod.id, nombre: prod.nombre, existenciasDisponibles: prod.existencias })
        }
      }
      UtilidadesController.returnRes(true, 'Productos invalidos', res, { invalidos });
    } else {
      UtilidadesController.returnRes(false, 'No envio productos', res);
    }
  },

  getProductoStockMin: async function (req, res) {
    let sql = 'SELECT "idProducto", "existencias", "nombre", "stockMin"'
    sql += ' FROM productos'
    sql += ' where "stockMin" + 2 >= "existencias" OR  "existencias" <= "stockMin"'

    let productosBD = await sails.sendNativeQuery(sql)
    let productos = productosBD.rows;

    UtilidadesController.returnRes(true, 'Productos próximos a quedarse sin stockMin', res, { productos });
  }
}