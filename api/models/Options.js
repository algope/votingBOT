/**
 * Options.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  migrate: 'drop',
  attributes: {
    option_id: {
      type: 'integer',
      unique: true
    },
    text:{
      type: 'string'
    },
    description_es:{
      type:'string'
    },
    description_ca:{
      type: 'string'
    }
  }
};

