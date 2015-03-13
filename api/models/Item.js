/**
* Item.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
	text: {
  		type: 'string',
  		required: true,
  	},

  	finished: {
  		type: 'boolean',
      required: true,
      defaultsTo: false
  	},

  	list: {
  		model: 'list'
  	}
  }
};

