import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import mycrypto from 'crypto';
import uniqueValidator from "mongoose-unique-validator"

const validate =  require('validator');

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


const userSchema = new mongoose.Schema(
  {
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
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin', 'superAdmin']
    },
    rememberme:{
      type:Boolean,
      default: false
    },
    verified:{type:Boolean, default:true},
    passwordChangedAt: {type: Number},
    passwordResetToken: {type: String},
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    passwordConfirm: {
      type: String
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

// userSchema.pre('save', function (next) {
//   if (this.password !== this.passwordConfirm) {
//     return next(new Error('Passwords do not match'));
//   }
//   next();
// });

userSchema.methods.correctPassword = async function(
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre('save', async function(next: any) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
  });

userSchema.pre('save', function(next:any) {
  if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
  mongoose.model('User').find({ active: { $ne: false } });
  next();
});



  // userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  //   if (this.passwordChangedAt) {
  //     const changedTimestamp: string = (this.passwordChangedAt.getTime() / 1000).toString();
  //     return changedTimestamp < JWTTimestamp.toString();
  //   }
  
  //   return false;
  // };

  userSchema.methods.changedPasswordAfter = function(JWTTimestamp: number) {
    if (this.passwordChangedAt) {
      const variablex:any =  this.passwordChangedAt.getTime() / 1000;
      
      const changedTimestamp:number = parseInt(variablex);
  
      return changedTimestamp < JWTTimestamp; 
    }
  
    return false;
  };
  
  
  
  userSchema.methods.createPasswordResetToken = function() {
    const resetToken = mycrypto.randomBytes(32).toString('hex');

    this.passwordResetToken = mycrypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({resetToken}, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    return resetToken;
  };

  userSchema.plugin(uniqueValidator, {
    message: " This {PATH} already exists"
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
