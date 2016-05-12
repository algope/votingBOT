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

module.exports.answeringRegisterS0 = function (command, userId, callback_query_id) {
  switch (command.commandId) {
    case 1: //butt_1 : SI
      telegram.sendMessage(userId, strings.getRegisterStep0, "", true, null, {hide_keyboard: true}).then(
        function (response) {
          stages.updateStage({user_id: userId}, {stage: 1});
          telegram.answerCallbackQuery(callback_query_id, strings.getStartReg, false);
        }
      );
      break;
    case 2: //butt_2 : NO
      telegram.sendMessage(userId, strings.getBye, "", true, null, {hide_keyboard: true}).then(
        function (response) {
          stages.updateStage({user_id: userId}, {stage: 0});
          telegram.answerCallbackQuery(callback_query_id, strings.getCancelReg, false);
        }
      );
      break;
  }

};

module.exports.answeringRegisterS1 = function (command, userId, callback_query_id) {
  telegram.sendMessage(userId, strings.getValidating, "", true, null, {hide_keyboard: true}).then(
    function (response) {
      Users.findOne({id: userId}).exec(function (ko, ok) {
        if (ok) {
          Users.update({id: userId}, {nid: command.nid}).exec(function (ko, ok) {
            if (ok) {
              sails.log.debug("[DB] - Answers.js NID INSERTED");
            } else if (ko) {
              sails.log.error("[DB] - Answers.js NID UPDATE ERROR: " + ko);
            }
          });
          if (sails.config.census.check == 1){ //Census User Check Activated
            if (ok.retry_nid < 3) {
              Census.findOne({nid: command.nid}).exec(function (ko, ok) {
                if (ok) {
                  stages.updateStage({user_id: userId}, {stage: 2});
                  Users.update({id: userId}, {nid: command.nid}).exec(function (ko, ok) {
                    if (ok) {
                      sails.log.debug("[DB] - Answers.js NID INSERTED");
                    } else if (ko) {
                      sails.log.error("[DB] - Answers.js NID UPDATE ERROR: " + ko);
                    }
                  });
                  telegram.sendMessage(userId, strings.getRegisterStep1, "", true, null, {hide_keyboard: true})
                } else if (!ok) {
                  telegram.sendMessage(userId, strings.getValidationErrorNID, "", true, null, {hide_keyboard: true});
                  Users.findOne({id: userId}).exec(function (ko, ok) {
                    if (ok) {
                      sails.log.debug("[DB] - Answers.js UPDATING retry NID");
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
              telegram.sendMessage(userId, strings.getBanned, "", true, null, {hide_keyboard: true});
              stages.bannUser({user_id: userId}, {banned: true});
            }

          } else{

            stages.updateStage({user_id: userId}, {stage: 2});
            Users.update({id: userId}, {nid: command.nid}).exec(function (ko, ok) {
              if (ok) {
                sails.log.debug("[DB] - Answers.js NID INSERTED");
              } else if (ko) {
                sails.log.error("[DB] - Answers.js NID UPDATE ERROR: " + ko);
              }
            });
            telegram.sendMessage(userId, strings.getRegisterStep1, "", true, null, {hide_keyboard: true})

          }

        } else if (ko) {
          sails.log.error("[DB] - Answers.js FindUserError: " + ko);
        }

      });


    }
  )
};

module.exports.answeringRegisterS2 = function (command, userId, callback_query_id) {
  telegram.sendMessage(userId, strings.getValidating, "", true, null, {hide_keyboard: true}).then(
    function (response) {
      Users.findOne({id: userId}).exec(function (ko, ok) {
        if (ok) {
          if (sails.config.census.check == 1){
            if (ok.retry_birth_date < 3) {
              var date = moment(command.date, "DD-MM-YYYY");
              var day = date.date();
              var month = date.month() + 1;
              var year = date.year();
              var dateToCheck = new Date(year + '-' + month + '-' + day);
              sails.log.debug("[DEV] - Answers.js DATE: " + date);
              Census.findOne({birth_date: dateToCheck}).exec(function (ko, ok) {
                if (ok) {
                  Users.update({id: userId}, {birth_date: dateToCheck}).exec(function (ko, ok) {
                    if (ok) {
                      sails.log.debug("[DB] - Answers.js DBIRTH INSERTED");
                    } else if (ko) {
                      sails.log.error("[DB] - Answers.js DBIRTH UPDATE ERROR: " + ko);
                    }
                  });
                  stages.updateStage({user_id: userId}, {stage: 3, valid: true}); //We validate the user in order to vote.
                  telegram.sendMessage(userId, strings.getRegisterOk, "", true, null, {hide_keyboard: true})
                } else if (!ok) {
                  telegram.sendMessage(userId, strings.getValidationErrorBDATE, "", true, null, {hide_keyboard: true});
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
              telegram.sendMessage(userId, strings.getBanned, "", true, null, {hide_keyboard: true});
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
            stages.updateStage({user_id: userId}, {stage: 3, valid: true}); //We validate the user in order to vote.
            telegram.sendMessage(userId, strings.getRegisterOk, "", true, null, {hide_keyboard: true})

          }

        } else if (ko) {
          sails.log.error("[DB] - Answers.js FindUserError: " + ko);
        }

      });

    }
  )


};


module.exports.answeringCommandsS0 = function (command, userId, userName) {
  sails.log.debug("[DEV] - answers.js COMMANDID: " + command.commandId);
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.getWelcome(userName), "", true, null, keyboards.createKeyboard(1));
      break;
    case 2: //ayuda
      telegram.sendMessage(userId, strings.getHelp0, "", true, null, {hide_keyboard: true});
      break;
    case 3: //sugerencias
      break;
    case 4: //votar
      telegram.sendMessage(userId, strings.getNotReadyToVote);
      telegram.sendMessage(userId, strings.getRegQuestion, "", true, null, keyboards.createKeyboard(1));
      break;
    case 5: //acerca_de
      telegram.sendMessage(userId, strings.getAcercaDe, "", true, null, {hide_keyboard: true});
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.getCancelar, "", true, null, {hide_keyboard: true}).then(
        function (response) {
          stages.updateStage({user_id: userId}, {stage: 0});

        }
      );
      break;
  }

};

module.exports.answeringCommandsS1 = function (command, userId, userName) {
  sails.log.debug("[DEV] - answers.js COMMANDID: " + command.commandId);
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.getWelcome(userName), "", true, null, keyboards.createKeyboard(1));
      break;
    case 2: //ayuda
      telegram.sendMessage(userId, strings.getHelp1, "", true, null, {hide_keyboard: true});
      break;
    case 3: //sugerencias
      break;
    case 4: //votar
      break;
    case 5: //acerca_de
      telegram.sendMessage(userId, strings.getAcercaDe, "", true, null, {hide_keyboard: true});
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.getCancelar, "", true, null, {hide_keyboard: true}).then(
        function (response) {
          stages.updateStage({user_id: userId}, {stage: 0});

        }
      );
      break;
  }

};

module.exports.answeringCommandsS2 = function (command, userId, userName) {
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.getWelcome(userName)).then(
        function (response) {
          stages.updateStage({user_id: userId}, {stage: 0});

        });
      break;

    case 2: //ayuda
      telegram.sendMessage(userId, strings.getHelp2, "", true, null, {hide_keyboard: true});
      break;
    case 3: //sugerencias
      break;
    case 4: //votar
      break;
    case 5: //acerca_de
      telegram.sendMessage(userId, strings.getAcercaDe, "", true, null, {hide_keyboard: true});
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.getCancelar, "", true, null, {hide_keyboard: true}).then(
        function (response) {
          stages.updateStage({user_id: userId}, {stage: 0});

        }
      );
      break;
  }

};

module.exports.answeringCommandsS3 = function (command, userId, userName) {
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.getReadyToVote(userName));
      break;
    case 2: //ayuda
      telegram.sendMessage(userId, strings.getHelp3, "", true, null, {hide_keyboard: true});
      break;
    case 3: //sugerencias
      break;
    case 4: //votar
      strings.getVoteOptions().then(function (response) {
        telegram.sendMessage(userId, response);
      });

      break;
    case 5: //acerca_de
      telegram.sendMessage(userId, strings.getAcercaDe, "", true, null, {hide_keyboard: true});
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.getCancelar, "", true, null, {hide_keyboard: true}).then(
        function (response) {
          stages.updateStage({user_id: userId}, {stage: 2});

        }
      );
      break;
  }
};

module.exports.answeringCommandsS4 = function (command, userId, userName) {
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.getAlreadyVotedWelcome(userName));
      break;
    case 2: //ayuda
      telegram.sendMessage(userId, strings.getLabeling, "", true, null, keyboards.createKeyboard(1));
      break;
    case 3: //sugerencias
      break;
    case 4: //votar
      telegram.sendMessage(userId, strings.getAlreadyVoted);
      break;
    case 5: //acerca_de
      telegram.sendMessage(userId, strings.getAcercaDe, "", true, null, {hide_keyboard: true});
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.getCancelar, "", true, null, {hide_keyboard: true}).then(
        function (response) {
          stages.updateStage({user_id: userId}, {stage: 4});

        }
      );
      break;
    case 7: //verificar
      telegram.sendMessage(userId, strings.getVerify, "", true, null, {hide_keyboard: true});
      break;
  }
};


module.exports.answeringVote = function (command, userId) {
  sails.log.debug("[DEV] - VOTE: : " + JSON.stringify(command.vote));

  var vote = command.vote;
  var cleanedVote = vote.replace(/[, ]+/g, " ").trim();
  var splitOptions = cleanedVote.split(" ");
  var flag = 0;

  sails.log.debug("CLEANED VOTE: : : : "+cleanedVote);
  sails.log.debug("SPLIT OPTIONS : : : : "+splitOptions);

  if(splitOptions.length>3){
    telegram.sendMessage(userId, strings.getVotingError);
  } else if(splitOptions.lenght<=3){
    for(var i=0; i<splitOptions.length; i++){
      if(parseInt(splitOptions[i])>9){
        flag++;
      }
    }

    if(flag>0){
      sails.log.debug("FLAG IS: : : "+flag);
      telegram.sendMessage(userId, strings.getVotingError2(flag));
    }else{
      sails.log.debug("FLAG ELSE IS : : :"+flag);
      var pass = "PASS"+ generator.generate({length: 15, numbers: true});
      var encryptedVote = cryptog.encrypt(command.vote, pass);
      sails.log.debug("[DEV] - Encrypted VOTE: " + encryptedVote);
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

          telegram.sendMessage(userId, strings.getVote(pass), "", true, null, {hide_keyboard: true});

          Users.update({id: userId}, {encrypted_vote: encryptedVote}).exec(function (ko, ok) {
            if (ko) {
              sails.log.error("[DB] - Answers.js - answeringVote ERROR: " + ko);
            } else if (ok) {
              stages.updateStage({user_id: userId}, {has_voted: true, stage: 4});
            }
          });
        }
      });
    }

  }



};

module.exports.answerVerify = function (command, userId) {
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
        telegram.sendMessage(userId, strings.getVerifiedVote(decryptedVote), "", true, null, {hide_keyboard: true});
      } else {
        telegram.sendMessage(userId, strings.getVerifiedError, "", true, null, {hide_keyboard: true});
      }

    }
  })


};

module.exports.answeringError = function (userId, update, userAlias, user) {
  telegram.sendMessage(userId, strings.getError);
};


