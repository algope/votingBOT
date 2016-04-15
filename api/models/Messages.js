/**
 * Messages.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    message_id: {
      type: 'integer',
      primaryKey: true,
      unique: true
    },
    from: {
      model: 'users',
      defaultsTo: null
    },
    date: {
      type: 'integer',
      defaultsTo: 0
    },
    chat: {
      model: 'chats',
      defaultsTo: null
    },
    input: {
      model: 'input',
      defaultsTo: null
    }

  }
};

