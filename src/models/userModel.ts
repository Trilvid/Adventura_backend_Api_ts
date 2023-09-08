import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import mycrypto from 'crypto';
import uniqueValidator from "mongoose-unique-validator"

const validate =  require('validator');


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
    rememberme:{
      type:Boolean,
      default: false
    },
    verified:{type:Boolean, default:false},
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



  userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
    if (this.passwordChangedAt) {
      const changedTimestamp: string = (this.passwordChangedAt.getTime() / 1000).toString();
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
