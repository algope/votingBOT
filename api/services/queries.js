/**
 * Query Services
 *
 * @description :: Server-side logic for managing Telegram's BOT Updates
 * @author      :: Alejandro González - algope@github
 * @licence     :: The MIT License (MIT)
 *
 */

module.exports.findOrCreateStage = function(userId) {
  return new Promise(function(resolve, reject){
    Stages.findOrCreateEntry({user_id: userId}, {user_id: userId, stage: 1}).exec(function(err, ok){
      if(err){
        reject(err);
      }else if(ok){
        resolve(ok.stage);
      }
    })
  });
};
