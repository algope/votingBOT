/**
 * Common String Services
 *
 * @description :: Server-side logic for managing Telegram's BOT Updates
 * @author      :: Alejandro González - algope@github
 * @licence     :: The MIT License (MIT)
 *
 */

module.exports.getError = "Ups, eso no me lo esperaba...\u{1F633}\n Revisa lo que me acabas de enviar";
module.exports.getBye = "Una pena \u{1F633}, me hubiera gustado seguir hablando contigo.\n" +
  "Si cambias de opinión, solo tienes que volver a escribir: /start";

module.exports.getStartReg = "Iniciando registro...";
module.exports.getCancelReg = "Registro cancelado.";
module.exports.getRegQuestion = "¿Quieres registrarte? Recuerda tener a mano tu número de DNI o NIE y tu Fecha de Nacimiento";


module.exports.getWelcome = function (userName) {
  return "Hola " + userName + ", ¡encantado de conocerte! \u{1F604}\n" +
    "Bienvenidx al sistema de votación.\nPara votar será necesario que nos digas tu DNI y fecha de Nacimiento y comprobemos que estás en el censo.\n" +
    "¿Quieres seguir?";
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
       resp += "\nSelecciona hasta \u{0038} opciones.\n"+
       "Envía tu voto utilizando los números de las opciones separados por comas.\n"+
         "Ejemplo: 31,55, 53,34, 42, 44, 36, 54 (si las opciones estuviesen numeradas entre el 31 y 55)\n"+
       "Nota: Los espacios en blanco entre los números son opcionales";
       resolve(resp);
     }

   })

 })
};

module.exports.getNotReadyToVote = "No vayas tan rápido, apenas nos conocemos... \u{1F648} Antes de votar, registrarte deberás. ";
module.exports.getVote = function(pass) {
  return "Tu voto ha sido guardado correctamente \u{2705} \n" +
  "Este es el código para verificar que tu voto es correcto: \n\n" + pass+"\n\n" +
    "Utiliza el comando /verificar para comprobarlo cuando quieras \u{1F604}";
};

module.exports.getVerify = "Vamos a verificar tu voto.\n" +
  "Envíame el código que te proporcioné cuando votaste:";

module.exports.getVerifiedVote = function (vote) {
  return "Tu voto es correcto \u{2705} \n"+
      "Esto es lo que votaste: "+vote;
};

module.exports.getVerifiedError = "Parece que la contraseña para descifrar el voto no es correcta \u{274C} \n" +
  "Vuelve a intentarlo o ponte en contacto con nosotros";

module.exports.getAlreadyVotedWelcome = function(userName){
  return "Hola de nuevo " + userName + ", Ya tenemos tu voto registrado correctamente, puedes verificar tu voto mediante el comando /verificar";
};

module.exports.getAlreadyVoted = "Ups, parece que ya has votado \u{1F633}, puedes verificar tu voto mediante el comando /verificar";

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

