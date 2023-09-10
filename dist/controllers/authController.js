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
Object.defineProperty(exports, "__esModule", { value: true });
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mycrypto = require('crypto');
const tryCatch = require('./../utils/tryCatch');
const AppError = require('./../utils/AppError');
const { promisify } = require('util');
const sendEmail = require('./../utils/sendEmail');
const Email = require('./../utils/sendEmail');
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};
const success = (statusCode, res, req, myuser, message) => {
    const token = createToken(myuser.id);
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });
    // Remove password from output
    myuser.password = undefined;
    // const url= `${process.env.BASE_URL}auth/${myuser._id}/verify/${token}`;
    res.status(statusCode).json({
        status: 'success',
        token,
        role: myuser.role,
        message,
        // url
    });
};
// verify user
exports.verifyUser = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ _id: req.params.id });
    if (!user) {
        throw new AppError(404, "Sorry this account is unavilable", 404);
    }
    else {
        const mytoken = yield createToken(user.id);
        if (!mytoken) {
            throw new AppError(400, "please try again later", 400);
        }
        yield User.updateOne({ _id: user.id }, {
            $set: { verified: true }
        });
        res.redirect(200, 'http://localhost:3000/login');
        if (res) {
            res.send("will now send email");
        }
        throw new AppError("Bad Request", "email was not sent", 400);
    }
}));
// module to get users
exports.getAllUsers = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield User.find();
    return res.status(200).json({
        total: data.length,
        data
    });
}));
exports.getUser = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield User.findById(req.user.id, {});
    return res.status(200).json(data);
}));
exports.getUserById = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield User.findById(req.params.id, {});
    if (!data)
        throw new AppError("Not Found", "This User does not exist", 404);
    return res.status(200).json(data);
}));
// creating a new user
exports.SignUp = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        mobile: req.body.mobile,
        country: req.body.country,
        password: req.body.password,
        role: req.body.role,
        active: req.body.active,
        photo: "https://res.cloudinary.com/ult-bank/image/upload/v1685139259/t9tjkxnb3nrmtjuizftp.png",
    });
    const message = `Hello ${user.firstname} welcome to Adventira,  your password? Submit a PATCH request with your new password and passwordConfirm to.\nIf you didn't forget your password, please ignore this email!`;
    yield sendEmail({
        email: user.email,
        subject: 'Welcome To Adventura',
        message
    });
    const token = createToken(user.id);
    const url = `${process.env.BASE_URL}auth/${user._id}/verify/${token}`;
    const msg = `Hello ${user.firstname}, you can verify your email here on ${url} thanks for your patience`;
    yield sendEmail({
        email: user.email,
        subject: 'Email verification',
        message: msg,
    });
    return success(201, res, req, user, user);
}));
// login module 
exports.Login = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, rememberme } = req.body;
    const user = yield User.findOne({ email }).select('+password');
    if (!email || !password) {
        throw new AppError("Unauthorized", "email or password cannot be empty", 401);
    }
    else if (!user || !(yield user.correctPassword(password, user.password))) {
        throw new AppError("Unauthorized", "invalid login details try again", 401);
    }
    else if (user.verified === false) {
        throw new AppError("Unauthorized", "your email is not verified, please go to your eamil and verify", 401);
    }
    else {
        if (rememberme) {
            yield User.updateOne({ email: user.email }, {
                $set: { rememberme: true }
            });
        }
        return success(200, res, req, user, "sucessfully logged in");
    }
}));
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};
// protecting the routes
exports.protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        res.status(401).json({
            message: "You are not Logged in!"
        });
    }
    const decoded = yield promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = yield User.findById(decoded._id);
    if (!currentUser) {
        res.status(401).json({
            message: "Sorry This account does not exists!"
        });
    }
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //   res.status(401).json({
    //     message: "This User recently changed password! please login again"
    //   })
    // }
    req.user = currentUser;
    res.locals.user = currentUser;
    return next();
});
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new AppError("unauthorized", 'you do not have permission to perform this action', 401);
        }
        next();
    };
};
exports.forgotPassword = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ email: req.body.email });
    try {
        const resetToken = user.createPasswordResetToken();
        yield user.save({ validateBeforeSave: false });
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
        const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
        yield sendEmail({
            email: user.email,
            subject: 'Email Reset Link',
            message
        });
        return res.status(200).json({
            status: 'success',
            message: 'Token sent to email',
            resetURL
        });
    }
    catch (err) {
        if (!user) {
            throw new AppError("Not Found", "Sorry this account does not exist", 404);
        }
        if (user.verified === false) {
            throw new AppError('Unauthorized', "Sorry this account is not verified, verify to contd", 401);
        }
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        yield user.save({ validateBeforeSave: false });
        return next();
    }
}));
exports.resetPassword = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedToken = mycrypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = yield User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) {
        throw new AppError("Bad Request", "Token is invalid or has expired", 400);
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    yield user.save();
    success(200, res, req, user, "passsword reset");
}));
exports.updatePassword = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findById(req.user.id).select('+password');
    if (!(yield user.correctPassword(req.body.passwordCurrent, user.password))) {
        throw new AppError("Unauthorized", "your current password is wrong.", 401);
    }
    else if (req.body.password != req.body.passwordConfirm) {
        throw new AppError("Bad Request", "password does not match", 400);
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    yield user.save();
    return success(200, res, req, user, ' Password Changed');
}));
exports.updateMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filterObj = (obj, ...allowedFields) => {
        const newObj = {};
        Object.keys(obj).forEach(el => {
            if (allowedFields.includes(el))
                newObj[el] = obj[el];
        });
        return newObj;
    };
    try {
        if (req.body.password || req.body.passwordConfirm) {
            return next(res.status(400).json({
                msg: 'this route is not for password update. please use /updateMyPassword.'
            }));
        }
        ``;
        const filteredBody = filterObj(req.body, 'firstname', 'lastname', 'photo');
        const updatedUser = yield User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true,
        });
        if (!updatedUser) {
            res.send({
                status: "failed",
                message: "no user with that ID found"
            });
        }
        res.status(201).json({
            status: "success",
            updatedUser,
            message: "Profile Updated"
        });
    }
    catch (err) {
        res.send(err.message);
        console.log(err.message);
    }
});
exports.deleteMe = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findByIdAndUpdate(req.user.id, { active: false });
    if (!user) {
        throw new AppError("Not Found", "This User does not exist ", 404);
    }
    res.status(204).json({
        status: 'ok',
        data: null
    });
}));
// exports.logout = (req:Request, res:Response, next:NextFunction) => {
//   // res.cookie('jwt', 'loggedout', {
//   //   expires: new Date(Date.now() + 10 * 1000),
//   //   httpOnly: true
//   // });
//   if ( 
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//     ) {
//       localStorage.removeItem("jwtToken");
//       console.log('logged out')
//     }
//   res.status(200).json({
//     status: "success"
//   });
// };
