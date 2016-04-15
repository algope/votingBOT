/**
 * InputController
 *
 * @description :: Server-side logic for managing Inputs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  input: function (req, res) {
    var update = req.body;
    sails.log.debug("UPDATE: : : "+ update);
    var userId = update.message.from.id;
    var command = false;
    var userName = update.message.from.first_name;
    var userAlias = update.message.from.username;

    Input.create(update, function (ko, ok) {
      if (ko) {
        sails.log.error("[DB] - InputController.js Updates.create error: ", ko);
      }
      if (ok) {
        sails.log.verbose("[DB] - InputController.js Updates.create ok: ", ok);
      }
    });

    if (update.message.text) {
      var text = update.message.text;
      command = commands.processIt(text);
    } else command = false;

    stages.findOrCreateEntry({user_id: userId}, {user_id: userId, stage: 1}).then(
      function (user) {
        sails.log.debug("[DEV] - InputController.js Stage: " + user.stage);

        if (user.stage == 1) { //start
          sails.log.debug("[DEV] - Stage 1. Command: " + command);
          if (update.message.photo || command.commandId == 0 || !command) {
            answers.answeringError(userId, update, userAlias, user);
          } else if (command.commandType == 1) {
            answers.answeringCommandsS1(command, userId, userName);
          } else {
            answers.answeringError(userId, update, userAlias, user);
          }

        }
      }
    );


    return res.ok();
  }
};

