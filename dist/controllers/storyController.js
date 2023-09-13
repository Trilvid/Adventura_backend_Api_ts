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
const Story = require('../models/storiesModel');
const tryCatch = require('./../utils/tryCatch');
const AppError = require('./../utils/AppError');
const success = (statusCode, res, message, author) => {
    res.status(statusCode).json({
        message,
        author
    });
};
exports.getAllStories = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const story = yield Story.find();
    res.status(200).json({
        total: story.length,
        story
    });
}));
// costom 
// interface UserData {
//     id: string;
//     role: string;
//     _id: string
//   }
//   declare global {
//     namespace Express {
//       interface Request {
//         user: UserData;
//       }
//     }
//   }
exports.newStory = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        title: req.body.title,
        story: req.body.story,
        image: req.body.image,
        user_id: req.user.id
    };
    const newStory = yield Story.create(data);
    success(201, res, newStory, data.user_id);
}));
exports.prevStory = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prev = yield Story.find({
        user_id: req.user.id
    });
    if (prev) {
        res.status(200).json({
            total: prev.length,
            data: prev
        });
    }
    else {
        throw new AppError("Bad Request", "No recent posts", 403);
    }
}));
exports.getAStory = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const story = yield Story.findById(req.params.id).populate('comments');
    if (!story) {
        throw new AppError("Not Found", "This story has been deleted", 404);
    }
    const author = story.user_id;
    success(200, res, story, author.firstname);
}));
exports.deleteStory = tryCatch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const story = yield Story.findByIdAndDelete(req.params.id);
    if (!story) {
        throw new AppError("Not Found", "Sorry This Accout does not exist ", 404);
    }
    success(204, res, "", "");
}));
