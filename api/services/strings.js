/**
 * Common String Services
 *
 * @description :: Server-side logic for managing Telegram's BOT Updates
 * @author      :: Alejandro González - algope@github
 * @licence     :: The MIT License (MIT)
 *
 */

var emoji = require('node-emoji');

module.exports.getVoteOptions = function (locale) {
  return new Promise(function(resolve, reject){
    Options.find().exec(function (ko, ok) {
      if (ok) {
        var resp = strings.tell('options.intro', locale);
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
        resp += strings.tell('options.footer', locale);
        resolve(resp);
      }

    })

  })
};

module.exports.getVoteText = function (vote){
  return new Promise(function(resolve, reject) {
    var arrayVote = vote.split(",");
    var options = "";

    sails.log.debug("ARRAY IIIIII : : : "+arrayVote[i]);
    Options.find().exec(function (ko, ok) {
      if (ko) {
        sails.log.error("[DB] - VotingController.js - optionsFind ERROR: " + ko);
      } else if (ok) {
        for (var i = 0; i < arrayVote.length; i++) {
          options += ok[arrayVote[i]].id + ". " + ok[arrayVote[i]].text;
        }
      }
    });
    resolve(options);
  });
};

module.exports.tell = function(id, locale, context){
  return emoji.emojify(sails.__({phrase: id, locale: locale}, context));
};

