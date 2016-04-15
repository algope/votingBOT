/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user_id: {
      type: 'integer',
      primaryKey: true,
      unique: true
    },
    first_name: {
      type: 'string',
      defaultsTo: ''
    },
    last_name: {
      type: 'string',
      defaultsTo: ''
    },
    username: {
      type: 'string',
      defaultsTo: ''
    },
    messages: {
      collection: 'messages',
      via: 'from',
      defaultsTo: null
    }
  }
};

