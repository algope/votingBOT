/**
 * Common String Services
 *
 * @description :: Server-side logic for managing Telegram's BOT Updates
 * @author      :: Alejandro González - algope@github
 * @licence     :: The MIT License (MIT)
 *
 */

var emoji = require('node-emoji');

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

module.exports.tell = function(id, locale, userName){
  return emoji.emojify(sails.__({phrase: id, locale: locale}, userName));
};

