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
var fs = require('fs');
// var bwipjs = require('bwip-js');
// var streamBuffers = require('stream-buffers');


module.exports.selectLanguage = function (command, userId, userName, callback_query_id){
  switch (command.commandId){
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
    case 5: //butt_eng
      telegram.answerCallbackQuery(callback_query_id, strings.tell('language.ban', 'en'), false);
      telegram.sendMessage(userId, strings.tell('welcome', 'en', userName), "", true, null, keyboards.createKeyboard(1, 'en'));
      stages.updateStage({user_id: userId}, {stage: 1, locale: 'en'});
      break;
  }

};

module.exports.answeringRegisterS0 = function (command, userId, callback_query_id, locale) {
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

module.exports.answeringRegisterS1 = function (command, userId, callback_query_id, locale) {
  telegram.sendMessage(userId, strings.tell('register.check', locale), "", true, null, {hide_keyboard: true});
  Users.findOne({id: userId}).exec(function (ko, ok) {
    if (ok) {
      Users.update({id: userId}, {nid: command.nid}).exec(function (ko, ok) {
        if (ko) {
          sails.log.error("[DB] - Answers.js NID UPDATE ERROR: " + ko);
        }
      });
      if (sails.config.census.check == 1){ //Census User Check Activated
        if (ok.retry_nid < 3) {
          Census.findOne({nid: command.nid}).exec(function (ko, ok) {
            if (ok) {
              stages.updateStage({user_id: userId}, {stage: 3});
              Users.update({id: userId}, {nid: command.nid}).exec(function (ko, ok) {
                if (ko) {
                  sails.log.error("[DB] - Answers.js NID UPDATE ERROR: " + ko);
                }
              });
              telegram.sendMessage(userId, strings.tell('register.bdate', locale), "", true, null, {hide_keyboard: true})
            } else if (!ok) {
              telegram.sendMessage(userId, strings.tell('register.error.nid', locale), "", true, null, {hide_keyboard: true});
              Users.findOne({id: userId}).exec(function (ko, ok) {
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

      } else{
        stages.updateStage({user_id: userId}, {stage: 3});
        Users.update({id: userId}, {nid: command.nid}).exec(function (ko, ok) {
          if (ko) {
            sails.log.error("[DB] - Answers.js NID UPDATE ERROR: " + ko);
          }
        });
        telegram.sendMessage(userId, strings.tell('register.bdate', locale), "", true, null, {hide_keyboard: true})
      }

    } else if (ko) {
      sails.log.error("[DB] - Answers.js FindUserError: " + ko);
    }

  });
};

module.exports.answeringRegisterS2 = function (command, userId, callback_query_id, locale) {
  telegram.sendMessage(userId, strings.tell('register.check', locale), "", true, null, {hide_keyboard: true});
  Users.findOne({id: userId}).exec(function (ko, ok) {
    if (ok) {
      var date = moment(command.date, "DD-MM-YYYY");
      var day = date.date();
      var month = date.month() + 1;
      var year = date.year();
      var dateToCheck = new Date(year + '-' + month + '-' + day);
      if (sails.config.census.check == 1){
        if (ok.retry_birth_date < 3) {
          Census.findOne({birth_date: dateToCheck}).exec(function (ko, ok) {
            if (ok) {
              Users.update({id: userId}, {birth_date: dateToCheck}).exec(function (ko, ok) {
                if (ko) {
                  sails.log.error("[DB] - Answers.js DBIRTH UPDATE ERROR: " + ko);
                }
              });
              stages.updateStage({user_id: userId}, {stage: 4, valid: true}); //We validate the user in order to vote.
              telegram.sendMessage(userId, strings.tell('register.complete', locale), "", true, null, {hide_keyboard: true})
            } else if (!ok) {
              telegram.sendMessage(userId, strings.tell('register.error.bdate', locale), "", true, null, {hide_keyboard: true});
              Users.findOne({id: userId}).exec(function (ko, ok) {
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

      } else{
        Users.update({id: userId}, {birth_date: dateToCheck}).exec(function (ko, ok) {
          if (ok) {
            sails.log.debug("[DB] - Answers.js DBIRTH INSERTED");
          } else if (ko) {
            sails.log.error("[DB] - Answers.js DBIRTH UPDATE ERROR: " + ko);
          }
        });
        stages.updateStage({user_id: userId}, {stage: 4, valid: true});
        telegram.sendMessage(userId, strings.tell('register.complete', locale), "", true, null, {hide_keyboard: true})
      }
    } else if (ko) {
      sails.log.error("[DB] - Answers.js FindUserError: " + ko);
    }

  });



};


module.exports.answeringCommandsS = function (command, userId, userName) {
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.tell('language.sel', 'es', userName), "", true, null, keyboards.createKeyboard(3));
      break;
  }
};

module.exports.answeringCommandsS0 = function (command, userId, userName, locale) {
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.tell('welcome', locale, userName), "", true, null, keyboards.createKeyboard(1));
      break;
    case 2: //ayuda
      //TODO
      break;
    case 3: //sugerencias
      break;
    case 4: //votar
      telegram.sendMessage(userId, strings.tell('voting.noRegistered', locale));
      telegram.sendMessage(userId, strings.tell('register.question', locale), "", true, null, keyboards.createKeyboard(1));
      break;
    case 5: //acerca_de
      //TODO
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.tell('cancel', locale), "", true, null, {hide_keyboard: true});
      stages.updateStage({user_id: userId}, {stage: 1});
      break;
    case 7: //idioma
      //TODO
  }

};

module.exports.answeringCommandsS1 = function (command, userId, userName, locale) {
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.tell('welcome', locale, userName), "", true, null, keyboards.createKeyboard(1));
      break;
    case 2: //ayuda
      //TODO
      break;
    case 3: //sugerencias
      //TODO
      break;
    case 4: //votar
      telegram.sendMessage(userId, strings.tell('voting.noRegistered', locale));
      break;
    case 5: //acerca_de
      //TODO
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.tell('cancel', locale), "", true, null, {hide_keyboard: true});
      stages.updateStage({user_id: userId}, {stage: 1});
      break;
  }

};

module.exports.answeringCommandsS2 = function (command, userId, userName, locale) {
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.tell('welcome', locale, userName), "", true, null, keyboards.createKeyboard(1));
      break;
    case 2: //ayuda
      //TODO
      break;
    case 3: //sugerencias
      break;
    case 4: //votar
      telegram.sendMessage(userId, strings.tell('voting.noRegistered', locale));
      telegram.sendMessage(userId, strings.tell('register.question', locale), "", true, null, keyboards.createKeyboard(1));
      break;
    case 5: //acerca_de
      //TODO
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.tell('cancel', locale), "", true, null, {hide_keyboard: true});
      stages.updateStage({user_id: userId}, {stage: 1});
      break;
    case 7: //idioma
    //TODO
  }

};

module.exports.answeringCommandsS3 = function (command, userId, userName, locale) {
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.tell('voting.ready', locale, userName));
      break;
    case 2: //ayuda
      //TODO
      break;
    case 3: //sugerencias
      //TODO
      break;
    case 4: //votar
      //TODO: TRANSLATION
      strings.getVoteOptions().then(function (response) {
        telegram.sendMessage(userId, response);
      });

      break;
    case 5: //acerca_de
      //TODO
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.tell('cancel', locale), "", true, null, {hide_keyboard: true});
      stages.updateStage({user_id: userId}, {stage: 1});
      break;
  }
};

module.exports.answeringCommandsS4 = function (command, userId, userName, locale) {
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.tell('voting.alreadyVote', locale));
      break;
    case 2: //ayuda
      //TODO
      break;
    case 3: //sugerencias
      //TODO
      break;
    case 4: //votar
      telegram.sendMessage(userId, strings.tell('voting.alreadyVote', locale));
      break;
    case 5: //acerca_de
      //TODO
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.tell('cancel', locale), "", true, null, {hide_keyboard: true});
      stages.updateStage({user_id: userId}, {stage: 1});
      break;
    case 7: //verificar
      telegram.sendMessage(userId, strings.tell('verifying', locale), "", true, null, {hide_keyboard: true});
      break;
  }
};


module.exports.answeringVote = function (command, userId, locale) {
  var vote = command.vote;
  var cleanedVote = vote.replace(/[, ]+/g, " ").trim();
  var splitOptions = cleanedVote.split(" ");
  var flag = 0;
  if(splitOptions.length>3){ //TODO: HARDCODED
    telegram.sendMessage(userId, strings.tell('voting.error', locale));
  } else if(splitOptions.length<=3){
    for(var i=0; i<splitOptions.length; i++){
      if(parseInt(splitOptions[i])>9){
        flag++;
      }
    }
    if(flag>0){
      telegram.sendMessage(userId, strings.tell('voting.incorrect', locale, flag));
    }else{
      var pass = "PASS"+ generator.generate({length: 15, numbers: true});
      var encryptedVote = cryptog.encrypt(command.vote, pass);
      Votes.create({vote: command.vote}).exec(function (ko, ok) {
        if (ko) {
          sails.log.error("[DB] - Answers.js - answeringVote ERROR: " + ko);
        } else if (ok) {
          //   bwipjs.toBuffer({bcid:	'code128', text: pass}, function (err, png) {
          //     if (err) {
          //       sails.log.error("ERROR toBuffer: "+err)
          //     } else {
          //       var myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
          //         frequency: 10,       // in milliseconds.
          //         chunkSize: 2048     // in bytes.
          //       });
          //
          //       telegram.sendPhoto(userId,myReadableStreamBuffer.put(png), null, null, null, null);
          //     }
          // });



          Users.update({id: userId}, {encrypted_vote: encryptedVote}).exec(function (ko, ok) {
            if (ko) {
              sails.log.error("[DB] - Answers.js - answeringVote ERROR: " + ko);
            } else if (ok) {
              Status.update({nid: ok.nid}, {has_voted: true, encrypted_vote: encryptedVote}).exec(function(ko, ok){
                if(ko){
                  sails.log.error("[DB] - Answers.js - answeringVote ERROR: " + ko);
                } else if(ok){
                  stages.updateStage({user_id: userId}, {has_voted: true, stage: 5});
                  telegram.sendMessage(userId, strings.tell('voting.success', locale), "", true, null, {hide_keyboard: true}).then(function(){
                    telegram.sendMessage(userId, pass).then(function(){
                      telegram.sendMessage(userId, strings.tell('voting.verify', locale));
                    })
                  });
                }
              });
            }
          });

        }
      });
    }

  }

};

module.exports.answerVerify = function (command, userId, locale) {
  var pass = command.pass;
  Users.findOne({id: userId}).exec(function (ko, ok){
    if(ko){
      sails.log.error("[DB] - Anwers.js answerVerify ERROR: "+ko);
    }
    if(ok){
      var decryptedVote = cryptog.decrypt(ok.encrypted_vote, pass);
      var regex = /^(\d+)(,\s*\d+)*/;
      var array = decryptedVote.split(" ");
      var matching = array[0].match(regex);
      if (matching) {
        telegram.sendMessage(userId, strings.tell('verifying.sucess', locale, decryptedVote), "", true, null, {hide_keyboard: true});
      } else {
        telegram.sendMessage(userId, strings.tell('verifying.error', locale), "", true, null, {hide_keyboard: true});
      }

    }
  })


};

module.exports.answeringError = function (userId, locale) {
  telegram.sendMessage(userId, strings.tell('error', locale));
};


