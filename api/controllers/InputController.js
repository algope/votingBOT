/**
 * InputController
 *
 * @description :: Server-side logic for managing Inputs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  input: function (req, res) {
    var update = req.body;
    sails.log.debug("[DEV] - InputController.js UPDATE: "+JSON.stringify(update));
    var userId = null;
    var userName = null;
    var userAlias = null;
    var text = null;
    var callback_query_id = null;
    if (update.callback_query) {
      userId = update.callback_query.from.id;
      userName = update.callback_query.from.first_name;
      userAlias = update.callback_query.from.username;
      text = update.callback_query.data;
      callback_query_id = update.callback_query.id;
    } else {
      userId = update.message.from.id;
      userName = update.message.from.first_name;
      userAlias = update.message.from.username;
      text = update.message.text;
    }

    var command = false;

    if (!update.callback_query) {
      Input.create(update, function (ko, ok) {
        if (ko) {
          sails.log.error("[DB] - InputController.js Updates.create error: ", ko);
        }
        if (ok) {
          sails.log.verbose("[DB] - InputController.js Updates.create ok");
        }
      });
    }

    if (text) {
      command = commands.processIt(text);
    } else command = false;

    sails.log.debug("[DEV] - TEXT: " + text);

    stages.findOrCreateEntry({user_id: userId}, {user_id: userId, stage: 0}).then(
      function (user) {
        sails.log.debug("[DEV] - InputController.js Stage: " + user.stage);


        if (user.stage == 0) { //start

          sails.log.debug("[DEV] - InputController.js CommandType: " + command.commandType);

          if (!command) {
            sails.log.debug("[DEV] - InputController.js 1");
            answers.answeringError(userId, update, userAlias, user);
          } else if (command.commandType == 1) {
            sails.log.debug("[DEV] - InputController.js 2");
            answers.answeringCommandsS1(command, userId, userName);
          } else if (command.commandType == 4) {
            sails.log.debug("[DEV] - InputController.js 3");
            answers.answeringRegisterS1(command, userId, callback_query_id);
          } else {
            sails.log.debug("[DEV] - InputController.js 4");
            answers.answeringError(userId, update, userAlias, user);
          }

        }
      }
    );

    sails.log.debug("[DEV] - Returning RES OK");

    return res.ok();
  }
};

