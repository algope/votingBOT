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
    var bdate = req.param('bdate');
    if(!dni || !bdate){
      return res.badRequest('Params expected.');
    }
    var date = moment(bdate, "DD-MM-YYYY");
    var day = date.date();
    var month = date.month() + 1;
    var year = date.year();
    var dateToCheck = new Date(year + '-' + month + '-' + day);

    if(validateNID(dni)){
      Census.findOne({dni: dni, birth_date: dateToCheck}).exec(function(ko, ok){
        if(ko){
          sails.log.error("KO: : : "+JSON.stringify(ko));
          return res.notFound({found: false});
        }else{
          if(ok==undefined){
            return res.notFound({found: false});
          }else{
            var name=ok.name;
            var surnames=ok.surnames;
            Status.findOrcreate({nid: dni, has_voted: false, user_type: 'Kiosk'}).exec(function(ko, ok){
              if(ko){
                sails.log.error("[DB] - ERROR creating STATUS row : "+ko);
              }else if (ok){
                return res.ok({found: true, name: name, surnames: surnames});
              }
            });

          }
        }
      });
    }else{
      return res.badRequest('Check DNI/NIE format');
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

