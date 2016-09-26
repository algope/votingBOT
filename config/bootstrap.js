/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  var username = process.env.ADMIN_USER;
  var password = process.env.ADMIN_PASSWORD;

  Admin.findOrCreate({email: username, password: password, confirmPassword: password}).exec(function (err, user) {
    if(err){
      sails.log.info("ERROR CREATING ADMIN!");
      cb();
    }else if(user){
      sails.log.info("ADMIN USER CREATED/FOUND SUCCESSFULLY");
      if(user.has_project){
        Project.findOne({user_id:user.id}).exec(function(ko, ok){
          if(ko){
            sails.log.error("ERROR RETRIEVING ADMIN PROJECT");
          }else if(ok){
            sails.config.telegram.token=ok.telegram_token;
            sails.config.census.check=ok.census_check;
            //sails.config.voting.voting_type=ok.voting_type;
            sails.config.sendgrid.mailTo=ok.intervention_email;
            sails.config.voting.enabled=1;
            cb();
          }
        })
      }else{
        cb();
      }
    }
  });
};
