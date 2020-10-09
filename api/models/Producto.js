/**
 * Producto.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'productos',
  attributes: {
    id: {
      type: 'number',
      autoIncrement: true,
      unique: true,
      columnName: 'idProducto',
    },
    nombre: {
      type: 'string',
      columnName: 'nombre'
    },
    existencias: {
      type: 'number',
      columnName: 'existencias'
    },
    precioVenta: {
      type: 'number',
      columnName: 'precioVenta'
    },
    tipoProducto: {
      type: 'number',
      columnName: 'tipoProducto'
    },
    estado: {
      type: 'number',
      columnName: 'estado'
    },
    descripcion: {
      type: 'string',
      columnName: 'descripcion'
    },
    unidadMedida: {
      type: 'number',
      columnName: 'unidadMedida'
    },  
    stockMin: {
      type: 'number',
      columnName: 'stockMin'
    },
    stockMax: {
      type: 'number',
      columnName: 'stockMax'
    },
    fechaCaducidad: {
      type: 'string',
      columnName: 'fechaCaducidad'
    }
  }
}