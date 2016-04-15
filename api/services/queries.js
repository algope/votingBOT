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
        sails.log.error("[DEV] - Queries.js findOrCreateStage error: "+err);
        reject(err);
      }else if(ok){
        sails.log.debug("[DEV] - Queries.js findOrCreateStage ok: "+ok);
        resolve(ok.stage);
      }
    })
  });
};
