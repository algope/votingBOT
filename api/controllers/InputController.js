/**
 * InputController
 *
 * @description :: Server-side logic for managing Inputs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  input: function (req, res) {
    var update = req.body;
    var userId = null;
    var userName = null;
    var userAlias = null;
    var text = null;
    if (update.callback_query) {
      userId = update.callback_query.from.id;
      userName = update.callback_query.from.first_name;
      userAlias = update.callback_query.from.username;
      text = update.callback_query.data;
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
            answers.answeringCommandsS1(command, userId, userName);
          } else {
            sails.log.debug("[DEV] - InputController.js 4");
            answers.answeringError(userId, update, userAlias, user);
          }

        }
      }
    );


    return res.ok();
  }
};

