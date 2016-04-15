/**
 * InputController
 *
 * @description :: Server-side logic for managing Inputs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  input: function (req, res) {
    var update = req.body;
    var userId = update.message.from.id;
    var command = false;
    var stage = queries.findOrCreateStage(userId);
    var userName = update.message.from.first_name;
    //var userLast = update.message.from.last_name;
    var userAlias = update.message.from.username;

    Input.create(update, function (ko, ok) {
      if (ko) {
        sails.log.error("[DB] - Updates.create error: ", ko);
      }
      if (ok) {
        sails.log.debug("[DB] - Updates.create ok: ", ok);
      }
    });

    if (update.message.text) {
      var text = update.message.text;
      command = commands.processIt(text);
    } else command = false;


    switch (stage) {
      case 1: //start
        if (update.message.photo || command.commandId == 0 || !command) {
          answers.answeringError(userId, update, userAlias, user);
        } else if (command.commandType == 1) {
          answers.answeringCommandsS1(command, userId, userName);
        } else {
          answers.answeringError(userId, update, userAlias, user);
        }
        break;

    }

    return res.ok();
  }
};

