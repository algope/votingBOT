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

    if (text.length > 200) {
      telegram.sendMessage(userId, strings.getTroll, "", true, null, {hide_keyboard: true});
      return res.ok();
    }

    var command = false;

    if (!update.callback_query) {
      Update.create(update, function (ko, ok) {
        if (ko) {
          sails.log.error("[DB] - InputController.js Updates.create error: ", ko);
        }
        if (ok) {
          sails.log.debug("[DB] - InputController.js Updates.create ok");
        }
      });
    }

    if (text) {
      command = commands.processIt(text);
    } else command = false;

    sails.log.debug("[DEV] - TEXT: " + text);
    stages.findOrCreateEntry({user_id: userId}, {user_id: userId, stage: 0}).then(
      function process(user) {
        if (!user.banned) {
          sails.log.debug("[DEV] - InputController.js Stage: " + user.stage);
          if (user.stage == 0) { //start
            if (!command) {
              answers.answeringError(userId, update, userAlias, user);
            } else if (command.commandType == 1) {
              answers.answeringCommandsS0(command, userId, userName);
            } else if (command.commandType == 4) {
              answers.answeringRegisterS0(command, userId, callback_query_id);
            } else {
              answers.answeringError(userId, update, userAlias, user);
            }


          } else if (user.stage == 1) { //Expecting NID
            if (!command) {
              answers.answeringError(userId, update, userAlias, user);
            } else if (command.commandType == 1) {
              answers.answeringCommandsS1(command, userId, userName);
            } else if (command.commandType == 5 || command.commandType == 6) {
              answers.answeringRegisterS1(command, userId, callback_query_id);
            } else {
              answers.answeringError(userId, update, userAlias, user);
            }

          } else if (user.stage == 2) { //Expecting Bdate
            if (!command) {
              answers.answeringError(userId, update, userAlias, user);
            } else if (command.commandType == 1) {
              answers.answeringCommandsS2(command, userId, userName);
            } else if (command.commandType == 7) {
              answers.answeringRegisterS2(command, userId, callback_query_id);
            } else {
              answers.answeringError(userId, update, userAlias, user);
            }

          } else if ((user.stage == 3) && user.valid) { //Ready To vote
            if (!command) {
              answers.answeringError(userId, update, userAlias, user);
            } else if (command.commandType == 1) {
              answers.answeringCommandsS3(command, userId, userName);
            } else if (command.commandType == 8) {
              answers.answeringVote(command, userId);
            } else {
              answers.answeringError(userId, update, userAlias, user);
            }

          } else if (user.stage == 4){ //Already voted
            if (!command) {
              answers.answeringError(userId, update, userAlias, user);
            } else if (command.commandType == 1) {
              answers.answeringCommandsS4(command, userId, userName);
            } else if (command.commandType == 9) {
              sails.log.debug("VERIFICAR!!!!!");
              answers.answerVerify(command, userId);
            } else {
              answers.answeringError(userId, update, userAlias, user);
            }
          }

        } else {
          telegram.sendMessage(userId, strings.getBanned, "", true, null, {hide_keyboard: true});
          return res.ok();
        }
      }
    );


    return res.ok();
  }
};

