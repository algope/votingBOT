/**
 * Common String Services
 *
 * @description :: Server-side logic for managing Telegram's BOT Updates
 * @author      :: Alejandro González - algope@github
 * @licence     :: The MIT License (MIT)
 *
 */

module.exports.getError =
    "Ups, eso no me lo esperaba... ¿Te has equivocado?";


module.exports.getWelcome = function (userName) {
    return "Hola " + userName + ", encantado de conocerte!\n" +
        "Bienvenido al sistema de votación. Para empezar será necesario que te registres.";
};

module.exports.getHelp1 = "Para enviar información, selecciona el comando: /enviar_info\n\n" +
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

module.exports.getProvStatistics = function(a, b, c, d, e, f, g, h){
    return "Estadísticas provisionales por categoría: \n\n" +
        "Cultura ------------------->"+a+" entradas\n" +
        "Economía ----------------->"+b+" entradas\n" +
        "Educación ---------------->"+c+" entradas\n" +
        "Medio Ambiente ---------->"+d+" entradas\n" +
        "Medios de Comunicación ->"+e+" entradas\n" +
        "Política ------------------->"+f+" entradas\n" +
        "Sanidad ------------------>"+g+" entradas\n" +
        "Otros temas -------------->"+h+" entradas"
};

