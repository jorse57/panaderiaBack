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
      numeroRecibo: {
        type: 'number',
        columnName: 'numeroRecibo',
      },
      fechaVenta: {
        type: 'number',
        columnName: 'fechaVenta'
      },
      idProducto: {
        type: 'number',
        columnName: 'idProducto'
      },
      cantidad: {
        type: 'number',
        columnName: 'cantidad'
      },
      precio: {
        type: 'number',
        columnName: 'precio'
      },
      idCliente: {
        type: 'number',
        columnName: 'idCliente'
      },
      idUsuario: {
        type: 'number',
        columnName: 'idUsuario'
      },      
      
    }
}