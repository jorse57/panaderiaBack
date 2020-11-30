/**
 * ventas.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'ventas',
    attributes: {
      id: {
        type: 'number',
        autoIncrement: true,
        unique: true,
        columnName: 'idVenta',
      },
      fechaVenta: {
        type: 'number',
        columnName: 'fechaVenta'
      },
      idProducto: {
        type: 'string',
        columnName: 'idProducto'
      },
      cantidad: {
        type: 'string',
        columnName: 'cantidad'
      },
      precio: {
        type: 'string',
        columnName: 'precio'
      },
      idCliente: {
        type: 'string',
        columnName: 'idCliente'
      },
      idUsuario: {
        type: 'string',
        columnName: 'idUsuario'
      },      
      
    }
}