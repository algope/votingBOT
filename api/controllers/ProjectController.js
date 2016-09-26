/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs');
var csvparse = require('csv-parse');
var moment = require('moment');

module.exports = {
  create: function(req, res){
    var telegram_token = req.param('telegram_token');
    var activate_census = req.param('activate_census');
    var voting_type = req.param('voting_type');
    var user_token = req.param('token');
    var intervention_email = req.param('intervention_email');

    var server_url = sails.getBaseUrl().split(":")[0];
    server_url = server_url+':'+sails.getBaseUrl().split(":")[1];
    var user_id = jwToken.getUserId(user_token);

    sails.log.debug("TELEGRAM_TOKEN: : "+telegram_token);
    sails.log.debug("SERVER_URL: : : "+server_url);

    if(activate_census == 1){
      req.file('census').upload({
        maxBytes: 10000000
      },function whenDone(err, uploadedFiles) {
        if (err) {
          return res.negotiate(err);
        }

        // If no files were uploaded, respond with an error.
        if (uploadedFiles.length === 0){
          return res.badRequest('No file was uploaded');
        }
        var fd = uploadedFiles[0].fd;
        var input = fs.createReadStream(fd);
        var parser = csvparse({columns: true});

        parser.on('readable', function(){
          while(record = parser.read()){
            //sails.log.debug("RECORD: "+JSON.stringify(record));
            var date = moment(record.birth_date, "DD-MM-YYYY");
            var day = date.date();
            var month = date.month() + 1;
            var year = date.year();
            var dateToInsert = new Date(year + '-' + month + '-' + day);
            Census.create({
              dni:record.dni,
              birth_date:dateToInsert,
              sex:record.sex,
              address:record.address,
              name:record.name,
              surname1:record.surname1,
              surname2:record.surname2

            }).exec(function (err, citizen) {
              if (err) {
                return res.serverError(err);
              }else if(citizen){
                sails.log.debug("CITIZEN INSERTED: "+JSON.stringify(citizen));
              }
            });
          }
        });
        parser.on('error', function(err){
          sails.log.error("CSV PARSE ERROR",err.message);
          res.badRequest({code: 'csv', message: err.message})
        });
        parser.on('finish', function(){
          sails.log.debug("END CSV PARSE");
          Project.create({
            user_id:user_id,
            telegram_token:telegram_token,
            server_url:server_url,
            voting_type:voting_type,
            census_activated:1,
            intervention_email: intervention_email
          }).exec(function(ko, ok){
            if(ko){
              res.serverError(ko);
            }else if(ok){
              sails.config.telegram.token=telegram_token;
              sails.config.census.check=activate_census;
              //sails.config.voting.voting_type=ok[0].voting_type;
              sails.config.sendgrid.mailTo=intervention_email;
              sails.config.voting.enabled=1;

              sails.log.debug("USER ID: "+user_id);
              Admin.update({id:user_id},{has_project:true}).exec(function(ko, ok){
                if(ko){
                  return res.serverError(ko);
                } else if(ok){
                  telegram.setWebHook(server_url);
                  sails.log.debug("OK ____ >"+JSON.stringify(ok));
                  return res.ok({
                    session: ok[0],
                    has_project: ok[0].has_project
                  });
                }
              });
              telegram.setWebHook(server_url);
            }

          });
        });
        input.pipe(parser);
      });

    }else{
      Project.create({
        user_id:user_id,
        telegram_token:telegram_token,
        server_url:server_url,
        census_activated:1,
        intervention_email:intervention_email
      }).exec(function(ko, ok){
        if(ko){
          res.serverError(ko);
        }else if(ok){
          sails.config.telegram.token=telegram_token;
          sails.config.census.check=activate_census;
          //sails.config.voting.voting_type=voting_type;
          sails.config.sendgrid.mailTo=intervention_email;
          sails.config.voting.enabled=1;
          Admin.update({id:user_id},{has_project:true}).exec(function(ko,ok){
            if(ko){
              return res.serverError(ko);
            } else if(ok){
              telegram.setWebHook(server_url);
              return res.ok({
                session: ok[0],
                has_project: ok[0].has_project
              });
            }
          });
        }
      });
    }
  },

  remove: function(req, res){

  }
};

