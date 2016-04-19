/**
 * Common String Services
 *
 * @description :: Server-side logic for managing Telegram's BOT Updates
 * @author      :: Alejandro González - algope@github
 * @licence     :: The MIT License (MIT)
 *
 */

module.exports.getError = "Ups, eso no me lo esperaba... ¿Te has equivocado?";
module.exports.getBye = "Una pena \u{1F633}, me hubiera gustado seguir hablando contigo.\n" +
  "Si cambias de opinión, solo tienes que volver a escribir: /start";

module.exports.getStartReg = "Iniciando registro...";
module.exports.getCancelReg = "Registro cancelado.";


module.exports.getWelcome = function (userName) {
  return "Hola " + userName + ", ¡encantado de conocerte! \u{1F604}\n" +
    "Bienvenidx al sistema de votación. Para empezar será necesario que te registres con tu DNI y Fecha de Nacimiento.\n" +
    "¿Quieres registrarte?";
};

module.exports.getRegisterStep0 = "Estupendo, ahora introduce tu DNI o NIE. Recuerda introducirlo con letra...";
module.exports.getRegisterStep1 = "Perfecto, indícame ahora tu Fecha de Nacimiento con el siguiente formato: DD/MM/AAAA";
module.exports.getRegisterOk = "Registro completo \u{2705}, Para empezar a votar selecciona el comando /votar";
module.exports.getValidating = "Comprobando censo... \u{23F3}";
module.exports.getValidationErrorNID = "Ups \u{1F633}, me temo que ha habido un error. Es posible que no te encuentres en el Censo de votantes\n" +
  "Vuelve a introducir tu DNI por si te hubieras equivocado.\n Tienes 3 intentos.";

module.exports.getValidationErrorBDATE = "Ups \u{1F633}, me temo que ha habido un error. Es posible que no te encuentres en el Censo de votantes\n" +
  "Vuelve a introducir tu Fecha de Nacimiento por si te hubieras equivocado.\n Tienes 3 intentos.";

module.exports.getBanned = "Lo siento \u{1F633}, has agotado los intentos para registrarte. Por seguridad he bloqueado tu usuario.";

module.exports.getTroll = "Uy, no tengo tiempo para leer tanto... \u{1F648}";

module.exports.getReadyToVote = function (userName) {
  return "Hola de nuevo " + userName + ", Ya tenemos todos tus datos verificados, ¿preparadx para votar? \u{1F604}\n";
};

module.exports.getVoteOptions = function () {
 return new Promise(function(resolve, reject){
   Options.find().exec(function (ko, ok) {
     if (ok) {
       var resp = "Opciones disponibles: \n\n";
       for (var i = 0; i < ok.length; i++) {
         resp += ok[i].id + " : " + ok[i].text + "\n";
       }
       resolve(resp);
     }

   })

 })
};


module.exports.getHelp0 = "Para enviar información, selecciona el comando: /enviar_info\n\n" +
  "Para volver a empezar, selecciona el comando: /cancelar\n\n" +
  "Para enviarnos una sugerencia sobre civicBOT, escribe /sugerencias";
module.exports.getHelp2 =
  "Ahora dinos qué tipo de información quieres hacernos llegar: TEXTO o IMAGEN.\n\n" +
  "Para volver a empezar, selecciona el comando: /cancelar";
module.exports.getHelp3 =
  "Ahora envía la información del tipo que has seleccionado anteriormente.\n\n" +
  "Para volver a seleccionar un tipo de información distinto, selecciona el comando: /enviar_info \n\n" +
  "Para volver a empezar, selecciona el comando: /cancelar";

module.exports.getFeedback =
  "Escribe la sugerencia que nos quieras hacer llegar:\n\n";

module.exports.getInfoSelect =
  "Pulsa el botón del tipo de información que quieres hacernos llegar:\n\n";


module.exports.getTextSelected =
  "Ahora escribe el texto que quieras enviarnos:\n\n";

module.exports.getImageSelected =
  "Ahora envía la imagen:\n\n";


module.exports.getLabeling =
  "Si la información está relacionada con:\n\n" +
  "Cultura -------------------> pulsa A\n" +
  "Economía -----------------> pulsa B\n" +
  "Educación ----------------> pulsa C\n" +
  "Medio Ambiente ----------> pulsa D\n" +
  "Medios de Comunicación -> pulsa E\n" +
  "Política -------------------> pulsa F\n" +
  "Sanidad ------------------> pulsa G\n" +
  "Otros temas --------------> pulsa H";

module.exports.getThanks =
  "¡Muchas gracias!";

module.exports.getAcercaDe =
  "Civic Bot es un proyecto de Grup Càlam.\n" +
  "Toda la información recibida será publicada en abierto en http://civicbot.hubcivico.org.\n" +
  "La información servirá para elaborar informes periódicos de la actuación de los partidos.";

module.exports.getCancelar =
  "Comando cancelado";

module.exports.getProvStatistics = function (a, b, c, d, e, f, g, h) {
  return "Estadísticas provisionales por categoría: \n\n" +
    "Cultura ------------------->" + a + " entradas\n" +
    "Economía ----------------->" + b + " entradas\n" +
    "Educación ---------------->" + c + " entradas\n" +
    "Medio Ambiente ---------->" + d + " entradas\n" +
    "Medios de Comunicación ->" + e + " entradas\n" +
    "Política ------------------->" + f + " entradas\n" +
    "Sanidad ------------------>" + g + " entradas\n" +
    "Otros temas -------------->" + h + " entradas"
};

