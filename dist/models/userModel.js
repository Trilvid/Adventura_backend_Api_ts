"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const validate = require('validator');
/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - firstname
 *        - lastname
 *        - username
 *        - email
 *        - password
 *        - country
 *        - mobile
 *      properties:
 *        firstname:
 *          type: string
 *          default: John
 *        lastname:
 *          type: string
 *          default: Deo
 *        username:
 *          type: string
 *          default: helloWorld
 *        email:
 *          type: string
 *          default: deo@gmail.com
 *        password:
 *          type: string
 *          default: 258745698
 *        country:
 *          type: string
 *          default: 9ja
 *        mobile:
 *          type: string
 *          default: 5425785
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        firstname:
 *          type: string
 *        lastname:
 *          type: string
 *        username:
 *          type: string
 *        email:
 *          type: string
 *        password:
 *          type: string
 *        country:
 *          type: string
 *        mobile:
 *          type: string
 *    LoginUser:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        password:
 *          type: string
 *        rememberme:
 *          type: boolean
 *    UserForgottenPassword:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *    UserResetPassword:
 *      type: object
 *      properties:
 *        password:
 *          type: string
 *        passwordConfirm:
 *          type: string
 *
 *    updatePassword:
 *      type: object
 *      properties:
 *        currentPassword:
 *          type: string
 *        password:
 *          type: string
 *        passwordConfirm:
 *          type: string
 *
 *    userProfile:
 *      type: object
 *      properties:
 *        firstname:
 *          type: string
 *        lastname:
 *          type: string
 *        photo:
 *          type: string
 */
const userSchema = new mongoose_1.default.Schema({
    firstname: {
        type: String,
        required: [true, 'this User must have a firstname'],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, 'this user should have a lastname'],
        trim: true
    },
    username: {
        type: String,
        required: [true, "user should have a username"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'this user must have an email'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validate.isEmail, 'please provide a valid email']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minLength: [8, 'minimum password lenght is 8 '],
        select: false
    },
    country: {
        type: String,
        required: [true, 'please select your country']
    },
    mobile: {
        type: Number,
        required: [true, 'sorry this field cannot be empty'],
        // validate: [validate.isMobilePhone, "please enter a valid mobile number"]
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'superAdmin']
    },
    rememberme: {
        type: Boolean,
        default: false
    },
    verified: { type: Boolean, default: false },
    passwordChangedAt: { type: Number },
    passwordResetToken: { type: String },
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    passwordConfirm: {
        type: String
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});
// userSchema.pre('save', function (next) {
//   if (this.password !== this.passwordConfirm) {
//     return next(new Error('Passwords do not match'));
//   }
//   next();
// });
userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(candidatePassword, userPassword);
    });
};
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        this.password = yield bcrypt_1.default.hash(this.password, 12);
        this.passwordConfirm = undefined;
        next();
    });
});
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew)
        return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});
userSchema.pre(/^find/, function (next) {
    mongoose_1.default.model('User').find({ active: { $ne: false } });
    next();
});
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = (this.passwordChangedAt.getTime() / 1000).toString();
        return changedTimestamp < JWTTimestamp.toString();
    }
    return false;
};
// userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = parseInt(
//       this.passwordChangedAt.getTime() / 1000,
//       10
//     );
//     return changedTimestamp < JWTTimestamp; 
//   }
//   return false;
// };
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    console.log({ resetToken }, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    return resetToken;
};
userSchema.plugin(mongoose_unique_validator_1.default, {
    message: " This {PATH} already exists"
});
const User = mongoose_1.default.model('User', userSchema);
module.exports = User;
