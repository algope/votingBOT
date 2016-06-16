/**
 * Project.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user_id: {
      type: 'string',
      required: true,
      unique: true
    },
    telegram_token: {
      type: 'string',
      required: true
    },
    server_url: {
      type: 'string',
      required: true
    },
    voting_type:{
      type: 'integer',
      required: true
    }


  }
};

