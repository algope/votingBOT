/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  connections: {
    mongodb: {
      adapter: 'sails-mongo',
      url: process.env.MONGO_URL
    }

  },

  models: {
    connection: 'localDiskDb',
    migrate: 'drop'


  },

  telegram: {
    token: process.env.TELEGRAM_TOKEN
  },

  census: {
    check: process.env.CENSUS_CHECK
  },

  sendgrid:{
    apikey: process.env.SENDGRID_APIKEY,
    mailTo: process.env.VOTE_VERIFICATION_MAIL,
    mailFrom: process.env.VOTE_VERIFICATION_MAILFROM,
    enabled: process.env.VOTE_VERIFICATION
  },

  port: 8080,

  orm: {
    _hookTimeout: 500000
  },
  pubsub: {
    _hookTimeout: 500000
  },

  globals:{
    authentication: {
      secret: process.env.AUTH_SECRET
    }
  },

  log: {
    level: process.env.LOG_LEVEL
  },

  authIP:{
    enabled: process.env.ENABLE_AUTH_IP
  }
};
