/**
 * Stage Consistency Services
 *
 * @description :: Server-side logic for managing Telegram's BOT Updates
 * @author      :: Alejandro González - algope@github
 * @licence     :: The MIT License (MIT)
 *
 */

module.exports.findOrCreateEntry = function (find, create) {
    return new Promise(function (resolve, reject) {
        Stages.findOrCreate(find, create, function (err, data) {
            if (err) {
                reject(err)
            }
            if (data) {
                resolve(data)
            }
        })
    })
};

module.exports.updateStage = function (find, update) {
    return new Promise(function (resolve, reject) {
        Stages.update(find, update, function (err, data) {
            if (err) {
                reject(err)
            }
            if (data) {
                resolve(data)
            }
        })
    })
};
