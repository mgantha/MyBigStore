var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var UserSchema = new mongoose.Schema({
    full_name: { type: String },
    email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
    role: {
        type: String,
    },
    hash: String,
    mobileno:String,
    salt: String,
   // verifytoken: String,
   // twf: { type: Boolean, default: true },
    status: { type: Boolean,required:false },
}, { timestamps: true });




UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function() {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        email: this.email,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

UserSchema.methods.toAuthJSON = function() {
    return {
        id: this._id,
        email: this.email,
        mobileno: this.mobileno,
    };
};

UserSchema.methods.toProfileJSONFor = function(user) {
    return {
        email: this.email,
        Name: this.full_name,
    };
};


mongoose.model('User', UserSchema);