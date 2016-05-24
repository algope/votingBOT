/**
 * CensusController
 *
 * @description :: Server-side logic for managing censuses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');

module.exports = {
  search: function(req, res){
    var dni = req.param('dni');
    var date = moment(req.param('bdate'), "DD-MM-YYYY");
    var day = date.date();
    var month = date.month() + 1;
    var year = date.year();
    var dateToCheck = new Date(year + '-' + month + '-' + day);

    if(validateNID(dni)){
      Census.findOne({dni: dni, birth_date: dateToCheck}).then(function(ko, ok){
        if(ko){
          sails.log.error("KO: : : "+ko);
          return res.notFound(ko);
        }else if(ok){
          return res.ok({found: true, name: ok.name});
        }
      });
    }else{
      return res.badRequest('Check DNI/NIE format')
    }
  }

};

function validateNID(value) {

  var validChars = 'TRWAGMYFPDXBNJZSQVHLCKET';
  var nifRexp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
  var nieRexp = /^[XYZ]{1}[0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
  var str = value.toString().toUpperCase();

  if (!nifRexp.test(str) && !nieRexp.test(str)) return false;

  var nie = str
    .replace(/^[X]/, '0')
    .replace(/^[Y]/, '1')
    .replace(/^[Z]/, '2');

  var letter = str.substr(-1);
  var charIndex = parseInt(nie.substr(0, 8)) % 23;

  return validChars.charAt(charIndex) === letter;
}

