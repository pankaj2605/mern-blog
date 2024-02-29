import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";


export const createComment =async(req,res,next) =>{
    const {content,postId,userId} =req.body;
    if(req.user.id !== userId){
        return next(errorHandler(403,'You are not allowed to create this comment'))
    }
    try{
        const newComment = new Comment({
            content,
            postId,
            userId,
        });
        await newComment.save();
        res.status(200).json(newComment);
    }catch(error){
        next(error)
    }
}