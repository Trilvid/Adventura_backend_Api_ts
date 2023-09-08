"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CatchError = require('./../utils/AppError');
const errorHandeler = (error, req, res, next) => {
    if (error.name === "ValidationError") {
        return res.status(400).send({
            type: "ValidatorError",
            details: error.message
        });
    }
    if (error instanceof CatchError) {
        return res.status(error.statusCode).json({
            errorCode: error.errorCode,
            title: "an error occurred",
            msg: error.message
        });
    }
    // return res.status(500).send("Something Went Wrong")
    return res.status(500).send(error.message);
};
module.exports = errorHandeler;
