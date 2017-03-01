var mongoose = require('mongoose'),
    BaseSchema = require('./base').BaseSchema,
    util = require('util');

var Schema = mongoose.Schema;
//var bcrypt = require('bcrypt');
var ObjectId = mongoose.Schema.Types.ObjectId;
var UserSchema = new BaseSchema({
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      required:[true, '{PATH} is required.'], //match: /^[\w][\w\-\.]*[\w]$/i,
      match : [
          new RegExp('^[a-z0-9_.-]+$', 'i'),
          '{PATH} \'{VALUE}\' is not valid. Use only letters, numbers, underscore or dot.'
      ],
      minlength:5,
      maxlength:60,
      //validate: [
      //  validators.isAlphanumeric(),
      //  validators.isLength(2, 60)
      //]
    },
    password: {
      type: String,
      required: false, // Only required if local
      trim: true,
      match: new RegExp('^.{8,64}$'),
      //set: function(value) { // User can only change their password if it's a local account
      //    if (this.local) {
      //        return value;
      //    }
      //    return this.password;
      //}
    },
    token: {
      type: String,
      required: false,
      trim: true
    },
    firstName: {
      type: String,
      trim: true,
      required: 'First Name is required'
    },
    lastName: {
      type: String,
      trim: true
    },
    gender: {
        type: String,
        lowercase: true,
        enum: ["male", "female"]
    },
    emailAddress: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'Email address is required' //,
      //validate: [ validate.email, 'invalid email address' ]
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    slug: {    // We will implement this later.
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      unique: true,
      match: /^[a-z0-9_-]+$/i
    },
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          var re = /^\d{10}$/;
          return (v == null || v.trim().length < 1) || re.test(v)
        },
        message: 'invalid phone number.'
      }
    },
    meta: {
      subDomain:{type:String},
      likes:[
        {
          type:Object,
          ref:'Pinup'
        }
      ],
      disLikes:[
        {
          type:Object,
          ref:'Pinup'
        }
      ],
      views:[
        {
          type:Object,
          ref:'Pinup'
        }
      ]
    },
    lastIPAddress: String,
    joinedDate: {
        type: Date,
        default: Date.now
    },
});

UserSchema.pre('save', function (next) {
  console.log(next);
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
