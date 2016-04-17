/**
 * Command Processing Services
 *
 * @description :: Server-side logic for managing Telegram's BOT Updates
 * @author      :: Alejandro González - algope@github
 * @licence     :: The MIT License (MIT)
 *
 */

//var Regex = require('regex');

module.exports.processIt = function (text) {
  var id = 0;
  var result = strip(text);
  if (result.type == 1) { //Main commands
    switch (result.command) {
      case "/start":
        id = 1;
        break;
      case "/ayuda":
        id = 2;
        break;
      case "/sugerencias":
        id = 3;
        break;
      case "/enviar_info":
        id = 4;
        break;
      case "/acerca_de":
        id = 5;
        break;
      case "/cancelar":
        id = 6;
        break;
      case "/resultados":
        id = 7;
        break;
      default:
        id = 0;
    }
    return {commandType: 1, commandId: id};
  }
  else if (result.type == 2) { //Classification
    switch (result.command) {
      case "A":
        id = "A";
        break;
      case "B":
        id = "B";
        break;
      case "C":
        id = "C";
        break;
      case "D":
        id = "D";
        break;
      case "E":
        id = "E";
        break;
      case "F":
        id = "F";
        break;
      case "G":
        id = "G";
        break;
      case "H":
        id = "H";
        break;
      default:
        id = 0;
    }
    return {commandType: 2, commandId: id};

  } else if (result.type == 3) { //Information type

    switch (result.command) {
      case "TEXTO":
        id = 1;
        break;
      case "IMAGEN":
        id = 2;
        break;
      default:
        id = 0;
    }
    return {commandType: 3, commandId: id};

  } else if (result.type == 4) {
    switch (result.command) {
      case "butt_1":
        id = 1;
        break;
      case "butt_2":
        id = 2;
        break;
      default:
        id = 0;
    }
    return {commandType: 4, commandId: id}
  } else if (result.type == 5) {
    return {commandType: 5, nid: result.command}
  } else if (result.type == 6) {
    return {commandType: 6, date: result.command}
  }

  else return false;

};

module.exports.validate = function (text) {
  return validate(text);

};

function strip(text) {
  var regex = /(\/[a-z\_A-Z]+)/;
  var regex2 = /\b([A-Z]{1}\b)/;
  var regex3 = /((TEXTO)|(IMAGEN)+)/;
  var regex4 = /(butt_)./;
  var regex5 = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
  var regex6 = /^[XYZ]{1}[0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
  var regex7 = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
  var array = text.split(" ");

  var matching = array[0].match(regex);
  var matching2 = array[0].match(regex2);
  var matching3 = array[0].match(regex3);
  var matching4 = array[0].match(regex4);
  var matching5 = array[0].toString().toUpperCase().match(regex5);
  var matching6 = array[0].toString().toUpperCase().match(regex6);
  var matching7 = array[0].match(regex7);


  if (matching) {
    return {command: matching[0], type: 1};
  } else if (matching2) {
    return {command: matching2[0], type: 2};
  } else if (matching3) {
    return {command: matching3[0], type: 3};
  } else if (matching4) {
    return {command: matching4[0], type: 4};
  } else if (matching5 && validate(text)) {
    return {command: matching5[0], type: 5};
  } else if (matching6 && validate(text)){
    return {command: matching6[0], type: 6};
  } else if (matching7){
    return {command: matching7[0], type: 7};
  }
  else return false;

}

function validate(value){

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

  if (validChars.charAt(charIndex) === letter) return true;

  return false;
}
