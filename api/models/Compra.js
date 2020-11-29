/**
 * Compras.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'compras',
    attributes: {
      id: {
        type: 'number',
        autoIncrement: true,
        unique: true,
        columnName: 'idCompra',
      },
      nitProveedor: {
        type: 'string',
        columnName: 'nitProveedor'
      },
      nombreProveedor: {
        type: 'string',
        columnName: 'nombreProveedor'
      },
      idProducto: {
        type: 'string',
        columnName: 'idProducto'
      },
      cantidad: {
        type: 'number',
        columnName: 'cantidad'
      },
      costo: {
        type: 'number',
        columnName: 'costo'
      },
      valor: {
        type: 'number',
        columnName: 'valor'
      },
      numeroRecibo: {
        type: 'string',
        columnName: 'numeroRecibo'
      },
      fechaCompra: {
        type: 'number',
        columnName: 'fechaCompra'
      },
      fechaEntregaP: {
        type: 'number',
        columnName: 'fechaEntregaP'
      },
    }
}