/**
 * Telegram Keyboard Services
 *
 * @description :: Server-side logic for managing Telegram's BOT Updates
 * @author      :: Alejandro González - algope@github
 * @licence     :: The MIT License (MIT)
 *
 */


module.exports.createKeyboard = function (type) {
  //TODO: HARDCODED
  var keyboard = "";
  var buttons = null;


  switch (type) {
    case 1:
      buttons = [[{text: "Si", callback_data: "butt_1"},{text: "No", callback_data: "butt_2"}]];
      keyboard = {inline_keyboard: buttons};
      break;
    case 2:
      buttons = [["TEXTO", "IMAGEN"]];
      keyboard = {keyboard: buttons, resize_keyboard: true, one_time_keyboard: true, selective: true};
      break;
    case 3:
      buttons = [[{text: "VAL", callback_data: "butt_val"},{text: "CAS", callback_data: "butt_cas"},{text: "ENG", callback_data: "butt_eng"}]];
      keyboard = {inline_keyboard: buttons};
      break;

  }
  return keyboard;
};
