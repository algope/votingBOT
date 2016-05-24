/**
 * Status.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    nid: {
      type: 'string',
      required: true,
      unique: true
    },
    has_voted:{
      type: 'boolean',
      required: true,
      defaultsTo: false
    },
    user_type:{
      type: 'string',
      defaultsTo: ''
    },
    encrypted_vote: {
      type: 'string',
      defaultsTo: ''
    }
  }
};

