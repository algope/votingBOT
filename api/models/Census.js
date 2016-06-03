/**
 * Census.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  migrate: 'drop',
  attributes: {
    dni: {
      type: 'string',
      required: true,
      unique: true // Yes unique one
    },
    birth_date:{
      type: 'date',
      required: true
    },
    sex:{
      type: 'string'
    },
    address:{
      type: 'string'
    },
    name:{
      type:'string'
    },
    surname1:{
      type:'string'
    },
    surname2:{
      type:'string'
    }
  }
};

