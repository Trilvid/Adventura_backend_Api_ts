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
const Comment = require('./../models/commentModel');
const tryCatch = require('./../utils/tryCatch');
const AppError = require('./../utils/AppError');
const success = (statusCode, res, message) => {
    res.status(statusCode).json({
        message
    });
};
exports.getAllComments = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield Comment.find();
    res.status(200).json({
        total: comment.length,
        comment
    });
}));
exports.newComment = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.storyId)
        req.body.storyId = req.params.storyId;
    // if (!req.body.user) req.body.user = req.user.id
    const data = {
        comment: req.body.comment,
        story: req.body.storyId,
    };
    const newComment = yield Comment.create(data);
    success(201, res, newComment);
}));
exports.getComment = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield Comment.findById(req.params.id);
    success(200, res, comment);
}));
exports.deleteComment = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
        throw new AppError("Not Found", "Sorry This Accout does not exist ", 404);
    }
    success(204, res, "");
}));
