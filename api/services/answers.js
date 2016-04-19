/**
 * Answering Services
 *
 * @description :: Server-side logic for managing Telegram's BOT Updates
 * @author      :: Alejandro González - algope@github
 * @licence     :: The MIT License (MIT)
 *
 */

var moment = require('moment');

module.exports.answeringRegisterS0 = function (command, userId, callback_query_id) {
  sails.log.debug("[DEV] - answers.js COMMANDID: " + command.commandId);
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
    case 7: //resultados
      //TODO: RESULTADOS
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
    case 7: //resultados
      //TODO: RESULTADOS
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
    case 7: //resultados
      //TODO: RESULTADOS
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
      strings.getVoteOptions().then(function(response){
        sails.log.debug("RESPONSE: : : "+response);
        telegram.sendMessage(userId, response);
      });

      break;
    case 5: //acerca_de
      telegram.sendMessage(userId, strings.getAcercaDe, "", true, null, {hide_keyboard: true});
      break;
    case 6: //cancelar
      telegram.sendMessage(userId, strings.getCancelar, "", true, null, {hide_keyboard: true}).then(
        function (response) {
          stages.updateStage({user_id: userId}, {stage: 1});

        }
      );
      break;
    case 7: //resultados
      //TODO: RESULTADOS
      break;
  }
};

module.exports.answeringCommandsS4 = function (command, userId, userName) {
  switch (command.commandId) {
    case 1: //start
      telegram.sendMessage(userId, strings.getWelcome(userName)).then(
        function (response) {
          stages.updateStage({user_id: userId}, {stage: 1});
        }
      );
      break;

    case 2: //ayuda
      telegram.sendMessage(userId, strings.getLabeling, "", true, null, keyboards.createKeyboard(1));
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
          stages.updateStage({user_id: userId}, {stage: 1});

        }
      );
      break;
    case 7: //resultados
      //TODO: RESULTADOS
      break;
  }
};


module.exports.answeringVote = function (command, userId) {
  switch (command.commandId) {
    case 1: //TEXTO
      telegram.sendMessage(userId, strings.getTextSelected, "", true, null, {hide_keyboard: true}).then(
        function (response) {
          stages.updateStage({user_id: userId}, {stage: 3, data_type_selected: 1})

        }
      );

      break;
    case 2: //IMAGEN
      telegram.sendMessage(userId, strings.getImageSelected, "", true, null, {hide_keyboard: true}).then(
        function (response) {
          stages.updateStage({user_id: userId}, {stage: 3, data_type_selected: 2});

        }
      );
      break;

  }
};

module.exports.answeringError = function (userId, update, userAlias, user) {
  telegram.sendMessage(userId, strings.getError).then(
    function (response) {
      mixpanel.track("Error", {
        distinct_id: update.update_id,
        from: userId,
        user_id: userAlias,
        text: update.message.text,
        photo: update.message.photo,
        user_stage: user.stage
      });

    }
  );
};

module.exports.answeringLabelingS3 = function (type, update, userId) {
  switch (type) {
    case 1:
      telegram.sendMessage(userId, strings.getLabeling, "", true, null, keyboards.createKeyboard(1)).then(
        function (response) {
          UserMedia.create({
            user_id: userId,
            photo: update.message.photo
          }, function (err, newUpdate) {
            if (newUpdate) {
              sails.log.verbose("USERMEDIA CREATED!!!!");
              stages.updateStage({user_id: userId}, {stage: 4});
            }

          });
        }
      );
      break;
    case 2:
      telegram.sendMessage(userId, strings.getLabeling, "", true, null, keyboards.createKeyboard(1)).then(
        function (response) {
          UserMedia.create({user_id: userId, text: update.message.text}, function (err, newUpdate) {
            if (newUpdate) {
              stages.updateStage({user_id: userId}, {stage: 4});
            }

          });
        }
      );
      break;
  }

};

module.exports.answeringThanksS4 = function (userId, command, update) {
  telegram.sendMessage(userId, strings.getThanks, "", true, null, {hide_keyboard: true}).then(
    function (response) {
      UserMedia.findOne({user_id: userId}, function (err, found) {
        if (found) {
          if (found.photo) {
            var max_size_node = util.getMax(found.photo, 'file_size');
            var photo_id = max_size_node.file_id;

            telegram.getFile(photo_id).then(function (response) {
              var path = response.result.file_path;
              telegram.pushToS3(path).then(function (response) {
                var photoUrl = sails.config.s3.cloudFrontUrl + response;
                sails.log.debug("PHOTO URL ::::: " + photoUrl);

                Label.findOne({label: command.commandId}).exec(function (ko, labelFound) {
                  if (ko) {
                    sails.log.error("DB ERROR Label : : : " + ko);
                  } else if (labelFound) {
                    Classify.create({
                      photo: photoUrl,
                      type: 1,
                      edited: 0,
                      published: 0,
                      label: labelFound.id,
                      message: update.message.message_id
                    }, function (err, ok) {
                      if (ok) {
                        stages.updateStage({user_id: userId}, {stage: 1}).then(
                          function (response) {
                            UserMedia.destroy({user_id: userId}, function (ko, ok) {
                              if (ok) {
                                mixpanel.people.increment(userId, "contributions");
                                mixpanel.track("Contribution", {
                                  distinct_id: update.update_id,
                                  from: userId,
                                  photo: update.message.photo
                                });

                              }
                            });
                          }
                        );
                      }
                    })

                  }
                })
              })
            })
          } else if (found.text) {
            Label.findOne({label: command.commandId}).exec(function (ko, labelFound) {
              if (ko) {
                sails.log.error("DB ERROR Label : : : " + ko);
              } else if (labelFound) {
                Classify.create({
                  text: found.text,
                  type: 2,
                  edited: 0,
                  published: 0,
                  label: labelFound.id,
                  message: update.message.message_id
                }, function (err, ok) {
                  if (err) {
                    sails.log.error("ERROR labeling image");
                  }
                  if (ok) {
                    stages.updateStage({user_id: userId}, {stage: 1}).then(
                      function (response) {
                        UserMedia.destroy({user_id: userId}, function (ko, ok) {
                          if (ok) {
                            mixpanel.people.increment(userId, "contributions");
                            mixpanel.track("Contribution", {
                              distinct_id: update.update_id,
                              from: userId,
                              text: update.message.text
                            });

                          }
                        });
                      }
                    );
                  }
                })

              }

            })


          }
        }
      });
    }
  );
};

module.exports.answeringThanksS10 = function (userId, update, userAlias) {
  telegram.sendMessage(userId, strings.getThanks, "", true, null, {hide_keyboard: true}).then(
    function (response) {
      Feedbacks.create({user_id: userId, text: update.message.text}, function (ko, ok) {
        if (ok) {
          mixpanel.track("Feedback", {
            distinct_id: update.update_id,
            from: userId,
            user_id: userAlias,
            text: update.message.text
          });
        }
      })
    }
  );
};
