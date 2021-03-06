/**
 * UsuariosController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const UtilidadesController = require('./UtilidadesController');

const self = module.exports = {

  crearAdmin: async function (req, res) {
    let user = {
      nombre: "admin",
      identificacion: "123",
      contrasena: await UtilidadesController.incriptarPass("123456"),
      correo: "elmonopanaderia53@gmail.com",
      telefono: "2222222",
      direccion: "cll 3",
      estado: 1,
      rol: 1
    }
    let correoExist = await UtilidadesController.compararSiExisteCorreo(user.correo);
    if (!correoExist) {
      usuario.create(user).then(() => {
        UtilidadesController.returnRes(true, 'Usuario creado', res);
      }).catch((err) => {
        sails.log.debug(err);
        UtilidadesController.returnRes(false, 'No se pudo crear el usuario', res);
      });
    } else {
      UtilidadesController.returnRes(false, 'Ya existe el primer admin', res);
    }
  },

  crearUsuario: async function (req, res) {
    let user = req.allParams();
    user.correo = user.correo.trim();
    let idExist = await UtilidadesController.compararSiExisteIdentificacion(user.identificacion)
    let correoExist = await UtilidadesController.compararSiExisteCorreo(user.correo);
    if (!idExist) {
      if (!correoExist && !idExist) {
        if (user.rol != 3) user.contrasena = await UtilidadesController.incriptarPass(user.contrasena);
        usuario.create(user).then(() => {
          UtilidadesController.returnRes(true, 'Usuario creado', res);
        }).catch((err) => {
          sails.log.debug(err);
          UtilidadesController.returnRes(false, 'No se pudo crear el usuario', res);
        });
      } else {
        UtilidadesController.returnRes(false, 'correo ya existe', res);
      }
    } else {
      UtilidadesController.returnRes(false, 'identificacion ya existe', res);
    }
  },

  actualizarUsuario: async function (req, res) {
    let user = req.allParams();
    user.correo = user.correo.trim();
    let correoExist = await UtilidadesController.compararSiExisteCorreo(user.correo);
    let user_db = await usuario.find({ where: { id: user.id } })
    if (!correoExist || user_db[0].correo === user.correo) {
      let update = {
        nombre: user.nombre,
        tipo_identificacion: user.tipo_identificacion,
        identificacion: user.identificacion,
        contrasena: user.contrasena,
        correo: user.correo,
        telefono: user.telefono,
        direccion: user.direccion,
        estado: user.estado,
        rol: user.rol
      }

      await usuario.update({ id: user.id }, update).then(() => {
        UtilidadesController.returnRes(true, 'usuario actualizado', res);
      }).catch((err) => {
        sails.log.debug(err);
        UtilidadesController.returnRes(false, 'usuario no actualizado', res);
      });

    } else {
      UtilidadesController.returnRes(false, 'Correo ya existe', res);
    }
  },

  postLogin: async function (req, res) {
    let userReq = req.allParams();
    let usu = await usuario.find({ where: { correo: userReq.correo } });
    if (usu.length == 0 || usu[0].rol === 3 ) {
      UtilidadesController.returnRes(false, 'Usuario/contraseña no coinciden', res);
    } else if (usu[0].estado === 0) {
      UtilidadesController.returnRes(false, 'El usuario no esta activo', res);
    } else {
      let validatePsw = await UtilidadesController.compararPassUsuario(userReq.contrasena, usu[0].contrasena);
      if (validatePsw) {
        let token = UtilidadesController.crearToken({ id: usu[0].id }, sails.jwtSecret);
        let data = {
          accessToken: token,
          id: usu[0].id,
          name: usu[0].name,
          rol: usu[0].rol,
        }
        UtilidadesController.returnRes(true, 'login success', res, data);
      } else {
        UtilidadesController.returnRes(false, 'Usuario/contraseña incorrectos', res);
      }
    }

  },

  quienEstaEnSesion: async function (req, res) {
    const token = req.headers.authorization;
    const secret = sails.jwtSecret;
    UtilidadesController.verificarSesionToken(token, secret).then((verify) => {
      usuario.find({ where: { id: verify.id } }).then((usu) => {
        UtilidadesController.returnRes(true, 'usuario en sesion', res, usu[0]);
      });
    })
  },

  getByid: async function (req, res) {
    let params = req.allParams()
    usuario.find({ where: { id: params.id } }).then((usu) => {
      UtilidadesController.returnRes(true, 'usuario por id', res, usu[0]);
    });
  },

  get: async function (req, res) {
    let params = req.allParams();
    try {
      let usuarios = await usuario.find({
        where: {}
      }).sort('id ASC');

      UtilidadesController.returnRes(true, 'usuarios', res, usuarios);
    } catch (err) {
      sails.log.debug(err);
      UtilidadesController.returnRes(false, 'error al obtner los usuarios', res);
    }
  },

  sendEmailForward: async function (req, res) {
    let params = req.allParams();
    try {
      let usu = await usuario.find({
        where: { correo: params.correo }
      })

      if (!usu[0]) {
        UtilidadesController.returnRes(false, 'Usuario no existe ', res);
      }

      let payload = {
        id: usu[0].id
      }

      let token = UtilidadesController.crearToken(payload, sails.jwtSecret)

      let a = await UtilidadesController.sendEmail(usu[0].correo, token)

      UtilidadesController.returnRes(true, 'Correo enviado', res);

    } catch (error) {
      sails.log.debug(error);
      UtilidadesController.returnRes(false, 'error al enviar el correo', res);
    }
  },

  cambiarContrasena: async function (req, res) {
    let params = req.allParams();
    let payload = await UtilidadesController.verificarToken(params.token, sails.jwtSecret, true)

    if (!payload) {
      UtilidadesController.returnRes(false, 'Se ha vencido el token', res);
    }

    let newPass = await UtilidadesController.incriptarPass(params.pass);

    let update = {
      contrasena: newPass + ''
    }
    await usuario.update({ id: payload.id }, update).then(() => {
      UtilidadesController.returnRes(true, 'Contraseña actualizada', res);
    }).catch((err) => {
      sails.log.debug(err);
      UtilidadesController.returnRes(false, 'Contraseña no actualizada', res);
    });
  },

  cambiarPass: async function (req, res) {
    let params = req.allParams();
    if (!params.id) {
      UtilidadesController.returnRes(false, 'Falta el ID del usuario', res);
    }
    if (!params.pass) {
      UtilidadesController.returnRes(false, 'Falta la nueva contraseña del usuario', res);
    }
    let newPass = await UtilidadesController.incriptarPass(params.pass);

    let update = {
      contrasena: newPass + ''
    }
    await usuario.update({ id: params.id }, update).then(() => {
      UtilidadesController.returnRes(true, 'Contraseña actualizada', res);
    }).catch((err) => {
      sails.log.debug(err);
      UtilidadesController.returnRes(false, 'Contraseña no actualizada', res);
    });
  },

  getByidentificacion: async function (req, res) {
    let params = req.allParams()
    console.log("parametro--->", params)
    let sqlFindCompra = 'SELECT "nombre", "rol", "telefono", "estado"'
    sqlFindCompra += ' from usuarios'
    sqlFindCompra += ' WHERE "identificacion" = \''+ params.id + '\''

    let infoProBD = await sails.sendNativeQuery(sqlFindCompra)
    let pro = infoProBD.rows;
    UtilidadesController.returnRes(true, 'Compra por numeroRecibo', res, pro[0]);
  },

  getClientes: async function (req, res) {
    let clientes = await usuario.find({ where: { rol: 3 } })
    UtilidadesController.returnRes(true, 'usuario por id', res, { clientes });
  }
}