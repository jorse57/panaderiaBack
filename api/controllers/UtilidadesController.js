/**
 * UtilidadesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

module.exports = {
  /**
   * Método para devolver la respuesta al front por medio del response.
   */
  returnRes: function (status, message, res, data) {
    if (data) {
      return res.send({
        status: status,
        message: message,
        data: data,
      });
    } else {
      return res.send({
        status: status,
        message: message,
      });
    }
  },

  /**
   * Generate randon token
   */
  generateRandomToken: function (large) {
    let token = "";
    for (let i = 0; i < large; i++) {
      token += Math.random().toString(36).slice(2);
    }
    return token;
  },
  /**
   * Método para crear el token de acceso de la cuenta de usuario,
   * el cuál expira en dos días.
   */
  crearToken: function (payload, jwtSecret) {
    return (token = jwt.sign(payload, jwtSecret, { expiresIn: "48h" }));
  },
  /**
   * Método para vetificar el token que llega como parámetro esté vigente.
   */
  verificarToken: async function (token, jwtSecret, info) {
    let tokenS = token.split(" ");
    try {
      let haveToken = jwt.verify(tokenS[1], jwtSecret);

      if (haveToken) {
        return info ? haveToken : true;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  /**
   * Método para verificar la informacion del token.
   */
  verificarSesionToken: async function (token, jwtSecret) {
    let tokenS = token.split(" ");
    try {
      let haveToken = jwt.verify(tokenS[1], jwtSecret);
      return haveToken;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  /**
   * Método para validar si existe una cuenta de usuario con el
   * correo que llega como parámetro.
   */
  compararSiExisteCorreo: async function (email) {
    let users = await usuario.find({ where: { correo: email } });
    if (users && users.length > 0) {
      return true;
    } else {
      return false;
    }
  },
  compararSiExisteIdentificacion: async function(identificacion){
    let users = await usuario.find({ where: { identificacion: identificacion }});
    if(users && users.length>0){
      return true;
    }else{
      return false;
    }
  }, 
  /**
   * Método para obtener una cadena encriptada del parámetro password.
   */
  incriptarPass: async function (password) {
    const saltRounds = 10;
    return await sails.bcrypt.hash(password, saltRounds);
  },
  /**
   * Método para comparar una cadena encriptada con una sencilla
   * para verificar si la sencilla encriptada es la encriptada.
   */
  compararPassUsuario: async function (password, hash) {
    return await sails.bcrypt.compare(password, hash);
  },
  /**
   * Método para obtener la información de la cuenta de usuario
   * por medio del atributo correo.
   */
  getUserByEmail: async function (email) {
    return await User.find({ where: { email: email } });
  },

  sendEmail: async function (to, token) {
    let transporter = nodemailer.createTransport({
      host: "smtp.googlemail.com", // Gmail Host
      port: 465, // Port
      secure: true, // this is true as port is 465
      auth: {
        user: "elmonopanaderia53@gmail.com", // generated ethereal user
        pass: "123abc*345", // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "yorse57@gmail.com", // sender address
      to: to, // list of receivers
      subject: "Recuperar contraseña", // Subject line
      //text: "Hello world?", // plain text body
      html: `Hola, en el siguiente enlace podrás cambiar la contraseña,  <a href="http://localhost:9000/#/forwardPassword/${token}">Cambiar.</a>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    return info
  },
};
