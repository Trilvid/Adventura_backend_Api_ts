import { Request, Response, NextFunction } from "express";
const Story = require('../models/storiesModel');
const tryCatch = require('./../utils/tryCatch');
const AppError = require('./../utils/AppError');

const success = (statusCode:number, res:Response, message:string, author:string) => {
    res.status(statusCode).json({
        message,
        author
    })
}

exports.getAllStories = tryCatch(async (req:Request, res:Response) => {
    const story = await Story.find()

    res.status(200).json({
        total: story.length,
        story
    })

})

exports.newStory = tryCatch(async (req:Request, res:Response) => {
    const data = {
        title: req.body.title,
        story: req.body.story,
        image: req.body.image,
        user_id: req.user.id
    }

    const newStory = await Story.create(data)

    success(201, res, newStory, data.user_id)

})

exports.prevStory = tryCatch(async (req:Request, res:Response) => {
    const prev = await Story.find({
        user_id: req.user.id
    })

    if(prev) {
        res.status(200).json({
            total: prev.length,
            data: prev
        })
    } else {
        throw new AppError("Bad Request", "No recent posts", 403)
    }
})

exports.getAStory = tryCatch(async (req:Request, res:Response) => {
    const story = await Story.findById(req.params.id).populate('comments')

    if(!story) {
        throw new AppError("Not Found", "This story has been deleted", 404)
    }

    const author = story.user_id

    success(200, res, story, author.firstname)
    
})


exports.deleteStory = tryCatch(async (req:Request, res:Response) => {
    const story = await Story.findByIdAndDelete(req.params.id)

    if(!story) {
        throw new AppError("Not Found", "Sorry This Accout does not exist ", 404)
    }

    success(204, res, "", "")
})  

