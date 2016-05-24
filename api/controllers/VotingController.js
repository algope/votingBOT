/**
 * VotingController
 *
 * @description :: Server-side logic for managing votings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var generator = require('generate-password');

module.exports = {
	vote: function(req, res){
    var dni = req.param('dni');
    var vote = req.param('vote');
    if(!dni || !vote){
      return res.badRequest('Expected params');
    }
    Status.findOne({nid: dni}).exec(function(ko, ok){
      if(ko){
        sails.log.error("KO: : : "+JSON.stringify(ko));
        return res.notFound("User not registered. Need to execute a census validation first");
      }else{
        if(ok==undefined){
          return res.notFound("User not registered. Need to execute a census validation first");
        }else{
          var pass = "PASS"+ generator.generate({length: 15, numbers: true});
          var encryptedVote = cryptog.encrypt(vote, pass);
          Votes.create({vote: vote}).exec(function(ko, ok){
            if(ko){
              return res.serverError(ko);
            }else if(ok){
              Status.update({nid: dni}, {has_voted: true, encrypted_vote: encryptedVote}).exec(function(ko, ok){
                if(ko){
                  return res.serverError(ko);
                }else if(ok){
                  return res.ok({has_voted: true, password: pass});
                }
              });
            }
          });
        }
      }
    });
  },

  verify: function(req, res){
    res.ok();
  }

};
