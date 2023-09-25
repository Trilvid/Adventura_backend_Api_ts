"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
/**
 * @openapi
 * components:
 *  schemas:
 *    CreateStoryInput:
 *      type: object
 *      required:
 *        - title
 *        - story
 *        - image
 *      properties:
 *        title:
 *          type: string
 *        story:
 *          type: string
 *        image:
 *          type: string
 *    StoryResponse:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        title:
 *          type: string
 *        story:
 *          type: string
 *        user_id:
 *          type: string
 *        image:
 *          type: string
 */
const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    story: {
        type: String,
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    image: { type: String },
    createdAt: { type: Date, default: Date.now() },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});
storySchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user_id',
        select: 'firstname username'
    });
    // mongoose.model('User').populate({
    //     path: 'user_id',
    //     select: 'firstname username'
    //   })
    next();
});
storySchema.virtual('comments', {
    ref: "Comment",
    foreignField: "story",
    localField: '_id'
});
const Story = mongoose.model('Story', storySchema);
module.exports = Story;
