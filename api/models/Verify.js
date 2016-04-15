/**
 * Verify.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    encryptedWho:{
      type: 'string',
      required: true
    },

    vid:{
      type: 'integer',
      required: true
    }

  }
};

