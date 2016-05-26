/**
 * Telegram Keyboard Services
 *
 * @description :: Server-side logic for managing Telegram's BOT Updates
 * @author      :: Alejandro González - algope@github
 * @licence     :: The MIT License (MIT)
 *
 */


module.exports.createKeyboard = function (type, locale) {
  //TODO: HARDCODED
  var keyboard = "";
  var buttons = null;


  switch (type) {
    case 1:
      buttons = [[{text: strings.tell('yes',locale), callback_data: "butt_1"},{text: strings.tell('no',locale), callback_data: "butt_2"}]];
      keyboard = {inline_keyboard: buttons};
      break;
    case 2:
      buttons = [["TEXTO", "IMAGEN"]];
      keyboard = {keyboard: buttons, resize_keyboard: true, one_time_keyboard: true, selective: true};
      break;
    case 3:
      buttons = [[{text: "VAL", callback_data: "butt_v"},{text: "CAS", callback_data: "butt_c"}]];
      keyboard = {inline_keyboard: buttons};
      break;

  }
  return keyboard;
};
