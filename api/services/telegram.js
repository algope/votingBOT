/**
 * Telegram API Services
 *
 * @description :: Server-side logic for managing Telegram's BOT Updates
 * @author      :: Alejandro González - algope@github
 * @licence     :: The MIT License (MIT)
 *
 */

var querystring = require('querystring');
var https = require('https');
var request = require('request');
var stream = require('stream');
var mime = require('mime');
var restler = require('restler');

module.exports.sendMessage = function (chat_id, text, parse_mode, disable_web_page_preview, reply_to_message_id, reply_markup) {
  var options = {
    host: sails.config.telegram.url,
    path: "/bot" + sails.config.telegram.token + '/sendMessage',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  var post_data = JSON.stringify({
    chat_id: chat_id,
    text: text,
    parse_mode: parse_mode,
    disable_web_page_preview: disable_web_page_preview,
    reply_to_message_id: reply_to_message_id,
    reply_markup: reply_markup
  });

  return new Promise(function (resolve, reject) {
    var postReq = https.request(options, function (res) {
      res.setEncoding('utf8');
      var json = "";
      res.on('data', function (chunk) {
        json += chunk;
      });
      res.on('end', function () {
        resolve(JSON.parse(json))
      });
    });
    postReq.write(post_data);
    postReq.end();
  });
};

module.exports.sendPhoto = function (chat_id, photo, caption, disable_notification, reply_to_message_id, reply_markup) {
  sails.log.debug("[DEV] - sendingPhoto");
  var options = {
    chat_id: chat_id
  };


  var data = {
    photo: {
      value: photo,
      filename: 'photo.png',
      contentType: 'image/png'
    },
    chat_id: chat_id
  };

  sails.log.debug("[DEV] - TYPE OF PHOTO: : : : "+typeof photo);

  // if (typeof photo == 'string') {
  //   sails.log.debug(">>>>>> IS A STRING!!!! >:>:>:>:>:>:>");
  //   options.photo=photo;
  //   data = undefined;
  // }

  return new Promise(function (resolve, reject) {
    sails.log.debug("INSIDE DA PROMISE!");
    var url = 'https://' + sails.config.telegram.url+"/bot" + sails.config.telegram.token + '/sendPhoto';
    sails.log.debug("URL : : : : : : : "+url);
    restler.post(url, {
      multipart: true,
      data: cata
    }).on("complete", function(data) {
      sails.log.debug("RESPONNNSEEEE : : : : : " +data);
    }).on("error", function(error){
      sails.log.error("RESPONNNSEEEE : : : : : " +error);
    }).on("success", function(data) {
      sails.log.debug("RESPONNNSEEEE : : : : : " +data);
    }).on("abort", function(data) {
      sails.log.debug("RESPONNNSEEEE : : : : : " +data);
    }).on("timeout", function(data) {
      sails.log.debug("RESPONNNSEEEE : : : : : " + data);
    }).on("actual response code", function(data) {
      sails.log.debug("RESPONNNSEEEE : : : : : " + data);
    })

  });
};

module.exports.answerCallbackQuery = function (callback_query_id, text, show_alert) {
  var options = {
    host: sails.config.telegram.url,
    path: "/bot" + sails.config.telegram.token + '/answerCallbackQuery',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  var post_data = JSON.stringify({
    callback_query_id: callback_query_id,
    text: text,
    show_alert: show_alert
  });

  return new Promise(function (resolve, reject) {
    var postReq = https.request(options, function (res) {
      res.setEncoding('utf8');
      var json = "";
      res.on('data', function (chunk) {
        json += chunk;
      });
      res.on('end', function () {
        resolve(JSON.parse(json))
      });
    });
    postReq.write(post_data);
    postReq.end();
  });
};


module.exports.setWebHook = function (url) {
  return new Promise(function (resolve, reject) {
    var formData = {
      url: url
    };
    request.post({
      url: 'https://' + sails.config.telegram.url + '/bot' + sails.config.telegram.token + '/setWebHook',
      formData: formData
    }, function (err, httpResponse, body) {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(body))
    });

  })
};

module.exports.getFile = function (file_id) {
  var options = {
    host: sails.config.telegram.url,
    path: '/bot' + sails.config.telegram.token + '/getFile?file_id=' + file_id
  };

  return new Promise(function (resolve, reject) {
    https.get(options, function (res) {
      var json = "";
      res.on('data', function (chunk) {
        json += chunk;
      });
      res.on('end', function () {
        resolve(JSON.parse(json));
      });
      res.on('error', function () {
      })
    });
  })
};

module.exports.pushToS3 = function (path) {
  var url = 'https://api.telegram.org/file/bot' + sails.config.telegram.token + '/' + path;
  var file = path.split('/');
  var file_name = file[1];

  return new Promise(function (resolve, reject) {
    var StreamingS3 = require('streaming-s3'),
      request = require('request');
    var rStream = request.get(url);
    var uploader = new StreamingS3(rStream, {
        accessKeyId: sails.config.s3.accessKeyId,
        secretAccessKey: sails.config.s3.secretAccessKey
      },
      {
        Bucket: sails.config.s3.bucket,
        Key: file_name,
        ContentType: 'image/jpeg'

      }, function (err, resp, stats) {
        if (err) {
          sails.log.error("ERROR IN PUSH TO S3: " + err);
          reject(err);
        }
        else if (resp) {
          resolve(file_name);
        }


      }
    );

  })
};

module.exports.downloadFile = function (file_path) {
  var options = {
    host: "api.telegram.org",
    path: "/file/bot" + sails.config.telegram.token + file_path
  };
  return new Promise(function (resolve, reject) {
    https.get(options, function (res) {
      var json = "";
      res.on('data', function (chunk) {
        json += chunk;
      });
      res.on('end', function () {
        resolve(JSON.parse(json));
      });
    });
  })
};

