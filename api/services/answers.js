/**
 * Answering Services
 *
 * @description :: Server-side logic for managing Telegram's BOT Updates
 * @author      :: Alejandro González - algope@github
 * @licence     :: The MIT License (MIT)
 *
 */

var moment = require('moment');
var generator = require('generate-password');
var sendgrid = require('sendgrid')(sails.config.sendgrid.apikey);

module.exports.selectLanguage = function (command, userId, userName, callback_query_id) {
  switch (command.commandId) {
    case 3: //butt_cas
      telegram.answerCallbackQuery(callback_query_id, strings.tell('language.ban', 'es'), false);
      stages.updateStage({user_id: userId}, {stage: 1, locale: 'es'});
      telegram.sendMessage(userId, strings.tell('welcome', 'es', userName), "", true, null, keyboards.createKeyboard(1, 'es'));
      telegram.answerCallbackQuery(callback_query_id, strings.tell('register.start', 'es'), false);
      break;
    case 4: //butt_val
      telegram.answerCallbackQuery(callback_query_id, strings.tell('language.ban', 'ca'), false);
      telegram.sendMessage(userId, strings.tell('welcome', 'ca', userName), "", true, null, keyboards.createKeyboard(1, 'ca'));
      stages.updateStage({user_id: userId}, {stage: 1, locale: 'ca'});
      break;
    // case 5: //butt_eng
    //   telegram.answerCallbackQuery(callback_query_id, strings.tell('language.ban', 'en'), false);
    //   telegram.sendMessage(userId, strings.tell('welcome', 'en', userName), "", true, null, keyboards.createKeyboard(1, 'en'));
    //   stages.updateStage({user_id: userId}, {stage: 1, locale: 'en'});
    //   break;
  }

};

module.exports.answeringRegisterS1 = function (command, userId, callback_query_id, locale) {
  switch (command.commandId) {
    case 1: //butt_1 : SI
      telegram.sendMessage(userId, strings.tell('register.nid', locale), "", true, null, {hide_keyboard: true});
      stages.updateStage({user_id: userId}, {stage: 2});
      telegram.answerCallbackQuery(callback_query_id, strings.tell('register.start', locale), false);
      break;
    case 2: //butt_2 : NO
      telegram.sendMessage(userId, strings.tell('goodbye', locale), "", true, null, {hide_keyboard: true});
      stages.updateStage({user_id: userId}, {stage: 1});
      telegram.answerCallbackQuery(callback_query_id, strings.tell('register.cancel', locale), false);
      break;
  }

};

module.exports.answeringRegisterS2 = function (command, userId, callback_query_id, locale) {
  var doc = command.nid;
  var nidsearch = doc;
  telegram.sendMessage(userId, strings.tell('register.check', locale), "", true, null, {hide_keyboard: true});
  Status.findOne({nid: command.nid}).exec(function (ko, ok){
    if(ko){
      sails.log.error("[DB] - Answers.js STATUS findeOne ERROR: "+ko);
    }else if(ok){
      if(ok.has_voted){
        telegram.sendMessage(userId, strings.tell('voting.alreadyVote', locale));
        stages.updateStage({user_id: userId}, {has_voted: true, stage: 5});
      }//TODO: FAILS 
    }else {
      if(nid.isDNI(doc)){
        nidsearch = "0"+doc;
      }
      Users.findOne({user_id: userId}).exec(function (ko, ok) {
        if (ok) {
          if (sails.config.census.check == 1) { //Census User Check Activated
            if (ok.retry_nid < 3) {
              var retry = 3-ok.retry_nid;
              Census.findOne({dni: nidsearch}).exec(function (ko, ok) {
                if (ok) {
                  stages.updateStage({user_id: userId}, {stage: 3});
                  Status.create({nid: doc, telegram_id: userId, has_voted: false, user_type: 'Telegram'}).exec(function(ko, ok){
                    if(ko){
                      sails.log.error("[DB] - Answers.js STATUS Create error: "+ko);
                    }
                  });
                  telegram.sendMessage(userId, strings.tell('register.bdate', locale), "", true, null, {hide_keyboard: true})
                } else if (!ok) {
                  telegram.sendMessage(userId, strings.tell('register.error.nid', locale, retry), "", true, null, {hide_keyboard: true});
                  Users.findOne({user_id: userId}).exec(function (ko, ok) {
                    if (ok) {
                      ok.retry_nid++;
                      ok.save(function (err, user) {
                      });
                    }
                  });
                } else if (ko) {
                  sails.log.error("[DB] - Answers.js Error validating NID");
                }
              });

            } else {
              telegram.sendMessage(userId, strings.tell('register.banned', locale), "", true, null, {hide_keyboard: true});
              stages.bannUser({user_id: userId}, {banned: true});
            }

          } else {
            stages.updateStage({user_id: userId}, {stage: 3});
            Status.create({nid: command.nid, telegram_id: userId, has_voted: false, user_type: 'Telegram'}).exec(function(ko, ok){
              if(ko){
                sails.log.error("[DB] - Answers.js STATUS Create error: "+ko);
              }
            });
            telegram.sendMessage(userId, strings.tell('register.bdate', locale), "", true, null, {hide_keyboard: true})
          }

        } else if (ko) {
          sails.log.error("[DB] - Answers.js FindUserError: " + ko);
        }

      });

    }
  });

};

module.exports.answeringRegisterS3 = function (command, userId, callback_query_id, locale) {
  telegram.sendMessage(userId, strings.tell('register.check', locale), "", true, null, {hide_keyboard: true});
  Users.findOne({user_id: userId}).exec(function (ko, ok) {
    if (ok) {
      var date = moment(command.date, "DD-MM-YYYY");
      var day = date.date();
      var month = date.month() + 1;
      var year = date.year();
      var dateToCheck = new Date(year + '-' + month + '-' + day);
      if (sails.config.census.check == 1) {
        if (ok.retry_birth_date < 3) {
          var retry = 3 - ok.retry_birth_date;
          Census.findOne({birth_date: dateToCheck}).exec(function (ko, ok) {
            if (ok) {
              stages.updateStage({user_id: userId}, {stage: 4, valid: true}); //We validate the user in order to vote.
              telegram.sendMessage(userId, strings.tell('register.complete', locale), "", true, null, {hide_keyboard: true})
            } else if (!ok) {
              telegram.sendMessage(userId, strings.tell('register.error.bdate', locale, retry), "", true, null, {hide_keyboard: true});
              Users.findOne({user_id: userId}).exec(function (ko, ok) {
                if (ok) {
                  ok.retry_birth_date++;
                  ok.save(function (err, user) {
                  });
                }
              });
            } else if (ko) {
              sails.log.error("[DB] - Answers.js Error validating Bdate");
            }
          });

        } else {
          telegram.sendMessage(userId, strings.tell('register.banned', locale), "", true, null, {hide_keyboard: true});
          stages.bannUser({user_id: userId}, {banned: true});
        }

      } else {
        stages.updateStage({user_id: userId}, {stage: 4, valid: true});
        telegram.sendMessage(userId, strings.tell('register.complete', locale), "", true, null, {hide_keyboard: true})
      }
    } else if (ko) {
      sails.log.error("[DB] - Answers.js FindUserError: " + ko);
    }

  });


};


module.exports.answeringCommandsS0 = function (command, userId, userName) {
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.tell('language.sel', 'es', userName), "", true, null, keyboards.createKeyboard(3));
      break;
    default:
          telegram.sendMessage(userId, strings.tell('error', locale));
  }
}; //LANGUAGE

module.exports.answeringCommandsS1 = function (command, userId, userName, locale) {
  sails.log.debug("COMMAND ID _ _ _ _ _ _ _ _ "+ command.commandId);
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.tell('welcome', locale, userName), "", true, null, keyboards.createKeyboard(1, locale));
      break;
    case 2: //ayuda
      telegram.sendMessage(userId, strings.tell('help.1', locale));
      break;
    case 3: //acerca_de
      telegram.sendMessage(userId, strings.tell('about', locale));
      break;
    case 4: //votar
      telegram.sendMessage(userId, strings.tell('voting.noRegistered', locale)).then(function(){
        telegram.sendMessage(userId, strings.tell('register.question', locale), "", true, null, keyboards.createKeyboard(1, locale));
      });
      break;
    case 5: //saber_mas
      telegram.sendMessage(userId, strings.tell('about.noRegistered', locale)).then(function(){
        telegram.sendMessage(userId, strings.tell('register.question', locale), "", true, null, keyboards.createKeyboard(1, locale));
      });
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.tell('cancel', locale), "", true, null, {hide_keyboard: true});
      //tages.updateStage({user_id: userId}, {stage: 1});
      break;
    case 7: //verificar
      telegram.sendMessage(userId, strings.tell('verifying.notRegistered', locale));
      break;
    default:
      telegram.sendMessage(userId, strings.tell('error', locale));
  }

}; //WELCOME

module.exports.answeringCommandsS2 = function (command, userId, userName, locale) {
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.tell('register.expect.nid', locale, userName));
      break;
    case 2: //ayuda
      telegram.sendMessage(userId, strings.tell('help.2', locale));
      break;
    case 3: //acerca_de
      telegram.sendMessage(userId, strings.tell('about', locale));
      break;
    case 4: //votar
      telegram.sendMessage(userId, strings.tell('voting.noRegistered', locale));
      break;
    case 5: //saber_mas
      telegram.sendMessage(userId, strings.tell('about.noRegistered', locale));
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.tell('cancel', locale), "", true, null, {hide_keyboard: true});
      //stages.updateStage({user_id: userId}, {stage: 1});
      break;
    case 7: //verificar
      telegram.sendMessage(userId, strings.tell('verifying.notRegistered', locale));
      break;
    default:
      telegram.sendMessage(userId, strings.tell('error', locale));
  }

}; //EXPECTING NID

module.exports.answeringCommandsS3 = function (command, userId, userName, locale) {
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.tell('register.expect.bdate', locale, userName));
      break;
    case 2: //ayuda
      telegram.sendMessage(userId, strings.tell('help.3', locale));
      break;
    case 3: //acerca_de
      telegram.sendMessage(userId, strings.tell('about', locale));
      break;
    case 4: //votar
      telegram.sendMessage(userId, strings.tell('voting.noRegistered', locale));
      break;
    case 5: //saber_mas
      telegram.sendMessage(userId, strings.tell('about.noRegistered', locale));
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.tell('cancel', locale), "", true, null, {hide_keyboard: true});
      //stages.updateStage({user_id: userId}, {stage: 1});
      break;
    case 7: //verificar
      telegram.sendMessage(userId, strings.tell('verifying.notRegistered', locale));
      break;
    default:
      telegram.sendMessage(userId, strings.tell('error', locale));
  }

}; //EXPECTING BD

module.exports.answeringCommandsS4 = function (command, userId, userName, locale) {
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.tell('voting.ready', locale, userName));
      break;
    case 2: //ayuda
      telegram.sendMessage(userId, strings.tell('help.4', locale));
      break;
    case 3: //acerca_de
      telegram.sendMessage(userId, strings.tell('about', locale));
      break;
    case 4: //votar
      strings.getVoteOptions(locale).then(function (response) {
        telegram.sendMessage(userId, response);
      });
      break;
    case 5: //saber_mas
      telegram.sendMessage(userId, strings.tell('about.question', locale));
      stages.updateStage({user_id: userId}, {stage: 10});
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.tell('cancel', locale), "", true, null, {hide_keyboard: true});
      //stages.updateStage({user_id: userId}, {stage: 1});
      break;
    case 7: //verificar
      telegram.sendMessage(userId, strings.tell('verifying.notRegistered', locale));
      break;
    default:
      telegram.sendMessage(userId, strings.tell('error', locale));
  }
}; //READY TO VOTE

module.exports.answeringCommandsS5 = function (command, userId, userName, locale) {
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.tell('voting.voteEnd', locale, userName));
      break;
    case 2: //ayuda
      telegram.sendMessage(userId, strings.tell('help.5', locale));
      break;
    case 3: //acerca_de
      telegram.sendMessage(userId, strings.tell('about', locale));
      break;
    case 4: //votar
      telegram.sendMessage(userId, strings.tell('voting.alreadyVote', locale));
      break;
    case 5: //saber_mas
      telegram.sendMessage(userId, strings.tell('about.question', locale));
      stages.updateStage({user_id: userId}, {stage: 10});
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.tell('cancel', locale), "", true, null, {hide_keyboard: true});
      //stages.updateStage({user_id: userId}, {stage: 1});
      break;
    case 7: //verificar
      telegram.sendMessage(userId, strings.tell('verifying', locale), "", true, null, {hide_keyboard: true});
      break;
    default:
      telegram.sendMessage(userId, strings.tell('error', locale));
  }
}; //HAVE_VOTED

module.exports.answeringCommandsS10 = function (command, userId, userName, locale) {
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.tell('voting.alreadyVote', locale));
      break;
    case 2: //ayuda
      telegram.sendMessage(userId, strings.tell('help.10', locale));
      break;
    case 3: //acerca_de
      telegram.sendMessage(userId, strings.tell('about', locale));
      break;
    case 4: //votar
      Status.findOne({telegram_id: userId}).exec(function(ko, ok){
        if(ko){
          sails.log.error("[DB] - Answers.js commandsS10 ERROR: "+ko);
        }else if(ok.has_voted){
          telegram.sendMessage(userId, strings.tell('voting.alreadyVote', locale));
        }else{
          stages.updateStage({user_id: userId}, {stage: 4});
          strings.getVoteOptions(locale).then(function (response) {
            telegram.sendMessage(userId, response);
          });
        }
      });

      break;
    case 5: //saber_mas
      telegram.sendMessage(userId, strings.tell('about.question', locale));
      stages.updateStage({user_id: userId}, {stage: 10});
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.tell('cancel', locale), "", true, null, {hide_keyboard: true});
      //stages.updateStage({user_id: userId}, {stage: 1});
      break;
    case 7: //verificar
      telegram.sendMessage(userId, strings.tell('verifying', locale), "", true, null, {hide_keyboard: true});
      break;
    default:
      telegram.sendMessage(userId, strings.tell('error', locale));
  }
}; //DISABLED: KNOW_MORE


module.exports.answeringVote = function (command, userId, locale) {
  var vote = command.vote;
  var cleanedVote = vote.replace(/ /g,'').trim();
  var splitOptions = cleanedVote.split(",");
  var sortedArray = splitOptions.slice().sort(function(a, b){return a-b});
  var flag = 0;
  sails.log.debug("[DEV] - RECEIVED AND CLEANED VOTE: : : "+cleanedVote);
  sails.log.debug("[DEV] - SPLITED AND SORTED VOTE: : : "+sortedArray);
  var duplicates = [];
  for (var j = 0; j < sortedArray.length -1; j++) {
    if (sortedArray[j + 1] == sortedArray[j]) {
      duplicates.push(sortedArray[j]);
    }
  }

  if(duplicates.length>0){
    telegram.sendMessage(userId, strings.tell('voting.error.duplicates', locale));
  }else if (sortedArray.length > 8) { //TODO: HARDCODED
    telegram.sendMessage(userId, strings.tell('voting.error', locale));
  } else if (sortedArray.length <= 8 && duplicates.length==0) {
    for (var i = 0; i < sortedArray.length; i++) {
      if (parseInt(sortedArray[i]) > 24 || parseInt(sortedArray[i]) < 1 ) {
        flag++;
      }
    }
    if (flag > 0) {
      telegram.sendMessage(userId, strings.tell('voting.incorrect', locale, flag));
    } else if (flag==0) {
      Status.findOne({telegram_id: userId}).exec(function(ko, ok){
        if(ko){
          sails.log.error("[DB] - Answers.js - answeringVote ERROR Status table: "+ko);
        }else if(ok){
          if(!ok.has_voted){
            var pass = "PASS" + generator.generate({length: 5, numbers: true});
            var encryptedVote = cryptog.encrypt(sortedArray.toString(), pass);
            Votes.create({vote: sortedArray.toString()}).exec(function (ko, ok) {
              if (ko) {
                sails.log.error("[DB] - Answers.js - answeringVote ERROR: " + ko);
              } else if (ok) {
                Users.update({user_id: userId}, {encrypted_vote: encryptedVote}).exec(function (ko, ok) {
                  if (ko) {
                    sails.log.error("[DB] - Answers.js - answeringVote ERROR: " + ko);
                  } else if (ok.user_id = userId) {
                    Status.update({telegram_id: userId}, {has_voted: true, encrypted_vote: encryptedVote}).exec(function (ko, ok) {
                      if (ko) {
                        sails.log.error("[DB] - Answers.js - answeringVote ERROR: " + ko);
                      } else if (ok[0].has_voted == true) {
                        stages.updateStage({user_id: userId}, {has_voted: true, stage: 5});
                        telegram.sendMessage(userId, strings.tell('voting.success', locale), "", true, null, {hide_keyboard: true}).then(function () {
                          telegram.sendMessage(userId, pass).then(function () {
                            telegram.sendMessage(userId, strings.tell('voting.verify', locale));
                          })
                        });
                        if(sails.config.sendgrid.enabled==1){
                          sendgrid.send({
                            to:       sails.config.sendgrid.mailTo,
                            from:     sails.config.sendgrid.mailFrom,
                            subject:  'Nuevo Voto',
                            text:     sortedArray.toString()
                          }, function(err, json) {
                            if (err) { return sails.log.error("MAIL ERROR: "+err); }
                            sails.log.debug("MAIL: "+json)
                          });
                        }

                      }
                    });
                  }
                });

              }
            });

          }else if(ok.has_voted){
            stages.updateStage({user_id: userId}, {has_voted: true, stage: 5});
            telegram.sendMessage(userId, strings.tell('voting.alreadyVote', locale))
          }
        }
      })

    }

  }

};

module.exports.answerVerify = function (command, userId, locale) {
  var pass = command.pass;
  Users.findOne({user_id: userId}).exec(function (ko, ok) {
    if (ko) {
      sails.log.error("[DB] - Anwers.js answerVerify ERROR: " + ko);
    }
    if (ok.encrypted_vote) {
      var decryptedVote = cryptog.decrypt(ok.encrypted_vote, pass);
      var regex = /^(\d+)(,\s*\d+)*/;
      var array = decryptedVote.split(" ");
      var matching = array[0].match(regex);
      if (matching) {

        telegram.sendMessage(userId, strings.tell('verifying.sucess', locale, decryptedVote), "", true, null, {hide_keyboard: true});
      } else {
        telegram.sendMessage(userId, strings.tell('verifying.error', locale), "", true, null, {hide_keyboard: true});
      }

    }else if(!ok.encrypted_vote){
      telegram.sendMessage(userId, strings.tell('verifying.error.notTelegram', locale));
    }
  })


};


module.exports.answeringGetInfo = function (command, userId, locale) {
  var vote = command.vote;
  var cleanedVote = vote.replace(/[, ]+/g, " ").trim();
  var splitOptions = cleanedVote.split(" ");
  var option = splitOptions[0];

  Options.findOne({option_id: option}).exec(function (ko, ok) {
    if (ko) {
      sails.log.error("[DB] - Answers.js ERROR options get info");
    } else if (ok) {
      if (locale == 'es') {
        telegram.sendMessage(userId, ok.description_es);

      } else if (locale == 'ca') {
        telegram.sendMessage(userId, ok.description_ca);
      }
    }
  })

};


module.exports.answeringError = function (userId, locale) {
  telegram.sendMessage(userId, strings.tell('error', locale));
};




