/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  connections: {
    'defaults': 'prodMySQL',
    prodMySQL:{
      adapter: 'sails-mysql',
      url: process.env.PROD_DB_URL
    }
  },

  models: {
    connection: 'devMySQL',
    migrate: process.env.MIGRATION_TYPE


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

  port: 80,

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
    level: "info"
  }

};
