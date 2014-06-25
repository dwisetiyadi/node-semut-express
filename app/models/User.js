/**
 * Module dependencies.
 */
var loader          = require('../libraries/loader');
var mongoose        = loader.node('mongoose');
var Schema          = mongoose.Schema
var CreateUpdatedAt = loader.node('mongoose-timestamp');
var crypto          = loader.node('crypto');


/**
 * User Schema
 */
var UserSchema = new Schema({
    email: {
        type      : String,
        unique    : true,
        required  : true,
        lowercase : true
    },
    name: {
        type     : String,
        required : true
    },
    photo: {
        type : String
    },
    vendor: [{
        provider    : { type: String },
        id          : { type: String },
        displayName : { type: String },
        name        : { type: Object },
        familyName  : { type: String },
        givenName   : { type: String },
        middleName  : { type: String },
        emails      : { type: Array },
        value       : { type: String },
        type        : { type: String },
        photos      : { type: Array },
        value       : { type: String }
    }],
    hashed_password: {
        type     : String,
        required : true
    },
    salt: {
        type : String
    }
});

UserSchema.plugin(CreateUpdatedAt);

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function(password) {
        this._password       = password;
        this.salt            = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() { return this._password });

/**
 * Validations
 */
var validatePresenceOf = function (value) {
    return value && value.length;
}

// the below 3 validations only apply if you are signing up traditionally

UserSchema.path('email').validate(function (email) {
    return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function (email, fn) {
    var User = mongoose.model('User');

    // Check only when it is a new user or when email field is modified
    if (this.isNew || this.isModified('email')) {
        User.find({ email: email }).exec(function (err, users) {
            fn(!err && users.length === 0);
        });
    } else {
        fn(true);
    }
}, 'Email already exists');

UserSchema.path('hashed_password').validate(function (hashed_password) {
    return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password)) {
        next(new Error('Invalid password'));
    } else {
        next();
    }
})

/**
 * Methods
 */
UserSchema.methods = {

    /**
    * Authenticate - check if the passwords are the same
    *
    * @param {String} plainText
    * @return {Boolean}
    * @api public
    */
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
    * Make salt
    *
    * @return {String}
    * @api public
    */
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
    * Encrypt password
    *
    * @param {String} password
    * @return {String}
    * @api public
    */
    encryptPassword: function (password) {
        if (!password) return '';
    
        var encrypred;
        try {
          encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
          return encrypred;
        } catch (err) {
            return ''
        }
    },

    generateConfirmationToken: function(password) {
        if (!password) return '';

        var encrypred_confirm_code;
        try {
            encrypred_confirm_code = crypto.createHmac('sha1',  this.salt).update(password).digest('hex');
            return encrypred_confirm_code;
        } catch (err) {
            return '';
        }
    }
}

module.exports = mongoose.model('User', UserSchema)