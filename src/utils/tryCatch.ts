import { Request, Response, NextFunction } from "express"
const CatchAsync = (controller: any) => async (req:Request, res: Response, next: NextFunction) => {
        try {
            await controller(req, res)
        } catch (error) {
            return next(error)
        }
}

module.exports = CatchAsync