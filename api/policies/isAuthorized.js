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

  if(sails.config.authIP.enabled == true){
    var ip = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    var regex = /213.201.88.25/;

    ip=ip.toString();

    sails.log.info("ISAUTHORIZED : : : : IP REQUEST: "+ip);

    if(!regex.test(ip)){
      sails.log.info("IP -----> "+ip+" ---> FORBIDDEN");
      return res.forbidden();
    }
    else if(regex.test(ip)){
      sails.log.info("IP -----> "+ip+" ---> ALLOWED");
      next();
    }
  }else{
    next();
  }


};
