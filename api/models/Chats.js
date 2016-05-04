/**
 * Chats.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    chat_id: {
      type: 'integer',
      primaryKey: true,
      unique: true
    },
    type: {
      type: 'string',
      defaultsTo: ''
    },
    title: {
      type: 'string',
      defaultsTo: ''
    },
    username: {
      type: 'string',
      defaultsTo: ''
    },
    first_name: {
      type: 'string',
      defaultsTo: ''
    },
    last_name: {
      type: 'string',
      defaultsTo: ''
    },
    messages: {
      collection: 'messages',
      via: 'chat',
      defaultsTo: null
    }

  }
};

