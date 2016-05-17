/**
 * Common String Services
 *
 * @description :: Server-side logic for managing Telegram's BOT Updates
 * @author      :: Alejandro González - algope@github
 * @licence     :: The MIT License (MIT)
 *
 */

var emoji = require('node-emoji');

module.exports.getError = "Ups, eso no me lo esperaba...\u{1F633} \nRevisa lo que me acabas de enviar";
module.exports.getBye = "Una pena \u{1F633}, me hubiera gustado seguir hablando contigo.\n" +
  "Si cambias de opinión, solo tienes que volver a escribir: /start";
module.exports.getStartReg = "Iniciando registro...";
module.exports.getCancelReg = "Registro cancelado.";
module.exports.getRegQuestion = "¿Quieres registrarte? Recuerda tener a mano tu número de DNI o NIE y tu Fecha de Nacimiento";
module.exports.getRegisterStep0 = "Estupendo, ahora introduce tu DNI o NIE. Recuerda introducirlo con letra...";
module.exports.getRegisterStep1 = "Perfecto, indícame ahora tu Fecha de Nacimiento con el siguiente formato: DD/MM/AAAA";
module.exports.getRegisterOk = "Registro completo \u2705, Para empezar a votar selecciona el comando /votar";
module.exports.getValidating = "Comprobando censo... \u23F3";
module.exports.getValidationErrorNID = "Ups \u{1F633}, me temo que ha habido un error. Es posible que no te encuentres en el Censo de votantes\n" +
  "Vuelve a introducir tu DNI por si te hubieras equivocado.\n Tienes 3 intentos.";
module.exports.getValidationErrorBDATE = "Ups \u{1F633}, me temo que ha habido un error. Es posible que no te encuentres en el Censo de votantes\n" +
  "Vuelve a introducir tu Fecha de Nacimiento por si te hubieras equivocado.\n Tienes 3 intentos.";
module.exports.getBanned = "Lo siento \u{1F633}, has agotado los intentos para registrarte. Por seguridad he bloqueado tu usuario.";
module.exports.getTroll = "Uy, no tengo tiempo para leer tanto... \u{1F648}";
module.exports.getVotingError = "Vaya, parece que has querido votar más de \u0033\uFE0F\u20E3 opciones. \n" +
  "Recuerda que como máximo puedes votar \u0033\uFE0F\u20E3 opciones.";

module.exports.getNotReadyToVote = "No vayas tan rápido, apenas nos conocemos... \u{1F648} Antes de votar, registrarte deberás. ";
module.exports.getVote = "Tu voto ha sido guardado correctamente \u2705 \n" +
  "Este es el código para verificar que tu voto es correcto:";

module.exports.getVote3 = "Utiliza el comando /verificar para comprobarlo cuando quieras \u{1F604}";

module.exports.getVerify = "Vamos a verificar tu voto.\n" +
  "Envíame el código que te proporcioné cuando votaste:";

module.exports.getVerifiedError = "Parece que la contraseña para descifrar el voto no es correcta \u274C \n" +
  "Vuelve a intentarlo o ponte en contacto con nosotros";

module.exports.getAlreadyVoted = "Ups, parece que ya has votado \u{1F633}, puedes verificar tu voto mediante el comando /verificar";



module.exports.getWelcome = function (userName) {
  return "Hola " + userName + ", ¡encantado de conocerte! \u{1F604}\n" +
    "Bienvenidx al sistema de votación.\nPara votar será necesario que nos digas tu DNI y fecha de Nacimiento y comprobemos que estás en el censo.\n" +
    "¿Quieres seguir?";
};
module.exports.getReadyToVote = function (userName) {
  return "Hola de nuevo " + userName + ", Ya tenemos todos tus datos verificados, ¿preparadx para votar? \u{1F604}\n";
};
module.exports.getVoteOptions = function () {
 return new Promise(function(resolve, reject){
   Options.find().exec(function (ko, ok) {
     if (ok) {
       var resp = "Selecciona los \u0033\uFE0F\u20E3 elementos que consideras más importantes para la toma de concienca:\n\n";
       for (var i = 0; i < ok.length; i++) {
         var id = ok[i].id;
         if(id<10){
           resp += ok[i].id+"\uFE0F\u20E3" + " : " + ok[i].text + "\n";
         } else if(id>=10){
           var idStr = ok[i].id.toString();
           var n1 = idStr.charAt(0);
           var n2 = idStr.charAt(1);
           resp += n1+"\uFE0F\u20E3"+n2+"\uFE0F\u20E3"+ " : " + ok[i].text + "\n";
         }

       }
       resp += "\nSelecciona hasta \u0033\uFE0F\u20E3 opciones.\n"+
       "Envía tu voto utilizando los números de las opciones separados por comas.\n"+
         "Ejemplo: 1, 3, 5 \n"+
       "Nota: Los espacios en blanco entre los números son opcionales.";
       resolve(resp);
     }

   })

 })
};


module.exports.getVotingError2 = function(num){
  return "Vaya, parece ser que "+num+" de las opciones introducidas no pertenencen al listado." +
    "Vuelve a emitir tu voto con las opciones del listado";
};

module.exports.getVerifiedVote = function (vote) {
  return "Tu voto es correcto \u2705 \n"+
      "Esto es lo que votaste: "+vote;
};



module.exports.getAlreadyVotedWelcome = function(userName){
  return "Hola de nuevo " + userName + ", Ya tenemos tu voto registrado correctamente, puedes verificar tu voto mediante el comando /verificar";
};


module.exports.tell = function(id, locale, userName){
  sails.log.debug("STRRRRIIIIINNNNGGG : : :" +emoji.emojify(sails.__({phrase: id, locale: locale}, userName)));
  return emoji.emojify(sails.__({phrase: id, locale: locale}, userName));
};

