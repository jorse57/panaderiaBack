/**
 * Usuario.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'usuarios',
  attributes: {
    id: {
      type: 'number',
      autoIncrement: true,
      unique: true,
      columnName: 'idUsuario',
    },
    nombre: {
      type: 'string',
      columnName: 'nombre'
    },
    identificacion: {
      type: 'string',
      columnName: 'identificacion'
    },
    contrasena: {
      type: 'string',
      columnName: 'contrasena'
    },
    correo: {
      type: 'string',
      columnName: 'correo'
    },
    telefono: {
      type: 'string',
      columnName: 'telefono'
    },
    direccion: {
      type: 'string',
      columnName: 'direccion'
    },
    estado: {
      type: 'number',
      columnName: 'estado'
    },
    rol: {
      type: 'number',
      columnName: 'rol'
    },

  }
}