import { NextFunction } from "express";

const mongoose = require('mongoose');

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateComment:
 *      type: object
 *      required:
 *        - comment
 *      properties:
 *        comment:
 *          type: string
 *    CommentResponse:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        comment:
 *          type: string
 *        story:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */


const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
    },
    createdAt:{
      type:Date,
      default: Date.now
    },
    story: {
        type: mongoose.Schema.ObjectId,
        ref: 'Story',
        // required: true
    }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
    timestamps: true
})

// remeber to add user name and photo so it can show those details sure 

commentSchema.pre(/^find/, function(this:any, next: NextFunction) {
  this.populate({
    path: 'story',
    select: 'title'
  })
  next();
})

const comments = mongoose.model('Comment', commentSchema);

module.exports = comments;