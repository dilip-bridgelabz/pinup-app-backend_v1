//
// Pipup Schema Base
//
'use strict';

var bcrypt = require('bcryptjs'),
    crypto = require('crypto'),
    mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    validate = require('mongoose-validate'),
    util = require('util');

require('mongoose-schema-jsonschema')(mongoose);

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var AbstractSchema = function (){
    Schema.apply(this, arguments);
    this.add({
      isDeleted: {
        type: Boolean
      },
      createdAt :{
        type: Date,
        default: Date.now
      },
      createdBy:{
        type : ObjectId,
        ref : 'users'
      },
      updatedAt:{
        type: Date,
        default: Date.now
      },
      updatedBy:{
        type : ObjectId,
        ref : 'users'
      },
      deletedAt:{
        type: Date,
        default: Date.now
      },
      deletedBy:{
        type : ObjectId,
        ref : 'users'
      }
    });
};
util.inherits(AbstractSchema, Schema);
var BaseSchema = new AbstractSchema();

module.exports = {
  BaseSchema : AbstractSchema
};
