/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Policy for restrict update requests by means of the host.
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

module.exports = function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  sails.log.info("ISAUTHORIZED : : : : IP REQUEST: "+ip);
  var auth_ip = process.env.AUTHORIZED_IP;

  ip=ip.toString();
  auth_ip=auth_ip.toString();

  if(!ip === auth_ip){
    sails.log.info("IP -----> "+ip+" ---> FORBIDDEN");
    return res.forbidden();
  }
  else if(ip === auth_ip){
    sails.log.info("IP -----> "+ip+" ---> ALLOWED");
    next();
  }

};
