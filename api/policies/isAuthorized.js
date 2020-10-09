/**
 * isAuthorized
 *
 * @description :: Policy to check if user is authorized with JSON web token
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

const UtilidadesController = require("../controllers/UtilidadesController");


/**
 * Módulo interceptor para validar cualquier petición que se realice.
 * Se valida el token y en caso de no tener o de estar vencido, se niega el acceso.
 */
module.exports = async function (req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        UtilidadesController.returnRes(false, 'no token', res);
    } else {
        const secret = sails.jwtSecret;
        let verify = await UtilidadesController.verificarToken(token, secret)
        if (verify) {
            next();
        } else {
            UtilidadesController.returnRes(false, 'sesion finalizada', res);
        }
    }
};