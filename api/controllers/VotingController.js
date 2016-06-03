/**
 * VotingController
 *
 * @description :: Server-side logic for managing votings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var generator = require('generate-password');
var sendgrid = require('sendgrid')(sails.config.sendgrid.apikey);

module.exports = {
	vote: function(req, res){
    var dni = req.param('dni');
    var vote = req.param('vote');
    var regex = /^(\d+(,\d+)*)?$/;
    var matching = vote.match(regex);
    var flag = 0;
    if(!dni || !vote){
      return res.badRequest('Expected params');
    }
    if(!matching){
      return res.badRequest({code: 1, text:'Vote is invalid: Format'});
    }else if (matching){
      var cleanedVote = vote.replace(/ /g,'').trim();
      var splitOptions = cleanedVote.split(",");
      var sortedArray = splitOptions.slice().sort();

      var duplicates = [];
      for (var j = 0; j < sortedArray.length -1; j++) {
        if (sortedArray[j + 1] == sortedArray[j]) {
          duplicates.push(sortedArray[j]);
        }
      }

      if(duplicates.length>0){
        return res.badRequest({code: 2, text:'Vote is invalid: Duplicates'});
      }else if (sortedArray.length > 8) {
        return res.badRequest({code: 3, text:'Vote is invalid: Length'});
      } else if (sortedArray.length <= 8 && duplicates.length==0) {
        for (var i = 0; i < sortedArray.length; i++) {
          if (parseInt(sortedArray[i]) > 24) {
            flag++;
          }
        }
        if (flag > 0) {
          return res.badRequest({code: 4, text:'Vote is invalid: Not in range'});

        } else if (flag == 0){
          Status.findOne({nid: dni}).exec(function(ko, ok){
            if(ko){
              sails.log.error("KO: : : "+JSON.stringify(ko));
              return res.notFound("User not registered. Need to execute a census validation first");
            }else{
              if(ok==undefined){
                return res.notFound("User not registered. Need to execute a census validation first");
              }else if(ok.has_voted){
                res.forbidden("The user has already voted");
              }else{
                var pass = "PASS"+ generator.generate({length: 15, numbers: true});
                var encryptedVote = cryptog.encrypt(sortedArray.toString(), pass);
                Votes.create({vote: sortedArray.toString()}).exec(function(ko, ok){
                  if(ko){
                    return res.serverError(ko);
                  }else if(ok){
                    Status.update({nid: dni}, {has_voted: true, encrypted_vote: encryptedVote}).exec(function(ko, ok){
                      if(ko){
                        return res.serverError(ko);
                      }else if(ok){
                        if(sails.config.sendgrid.enabled==1){
                          sendgrid.send({
                            to:       sails.config.sendgrid.mailTo,
                            from:     sails.config.sendgrid.mailFrom,
                            subject:  'Nuevo Voto',
                            text:     sortedArray.toString()
                          }, function(err, json) {
                            if (err) { return sails.log.error("MAIL ERROR: "+err); }
                            sails.log.debug("MAIL: "+json)
                          });
                        }
                        return res.ok({has_voted: true, password: pass});
                      }
                    });
                  }
                });
              }
            }
          });
        }
      }


    }

  },

  verify: function(req, res){
    var dni = req.param('dni');
    var password = req.param('password');
    if(!dni || !password){
      return res.badRequest('Expected params');
    }

    Status.findOne({nid: dni}).exec(function(ko, ok){
      if(ko){
        sails.log.error("KO: : : "+JSON.stringify(ko));
        return res.notFound("User not registered. Need to execute a census validation + voting first");
      }else{
        if(ok==undefined){
          return res.notFound("User not registered. Need to execute a census validation first");
        }else{
          var decryptedVote = cryptog.decrypt(ok.encrypted_vote, password);
          var regex = /^(\d+)(,\s*\d+)*/;
          var array = decryptedVote.split(" ");
          var matching = array[0].match(regex);
          if (matching) {
            sails.log.debug("MATCHING!!!!!");
            strings.getVoteText(decryptedVote).then(function (response) {
              sails.log.debug("RESPONSSSSEEEEE: : :"+ JSON.stringify(response));
              return res.ok({verfied: true, vote: decryptedVote, options: response});
            });

          } else {
            return res.notFound({verfied: false, reason: 'Wrong password'});
          }
        }

      }
    })

  }

};
