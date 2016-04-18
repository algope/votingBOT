/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
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
    },
    nid: {
      type: 'string',
      unique: true
    },
    birth_date:{
      type: 'date'
    },
    valid: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },
    retry_nid: {
      type: 'integer',
      defaultsTo: 0
    },
    retry_birth_date: {
      type: 'integer',
      defaultsTo: 0
    },
    has_voted: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },
    encrypted_vote_id: {
      type: 'string',
      required: true,
      defaultsTo: null
    }
  }
};

