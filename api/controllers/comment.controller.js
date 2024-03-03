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

export const getPostComments =async (req,res,next) =>{
    try{
        const comments =await Comment.find({postId :req.params.postId}).sort({createdAt:-1});
        res.status(200).json(comments);
    }catch(error){
        next(error);
    }
}


export const likeComment =async (req,res,next) =>{
    if(!req.user.id){
        return next(errorHandler(403,'You are not allowed to like this comment'))
    }

    try{
        const comment =await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404,'Comment not found'))
        }
        const userIndex =comment.likes.indexOf(req.user.id);
        if(userIndex === -1){
            comment.numbersOfLikes = comment.numbersOfLikes + 1;
            comment.likes.push(req.user.id);
        }else{
            comment.numbersOfLikes =comment.numbersOfLikes - 1;
            comment.likes.splice(userIndex,1)
        }
        await comment.save();
        res.status(200).json(comment);
    }catch(error){
        next(error);
    }
}




export const editComment =async (req,res,next) =>{
    try{
        const comment =await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404,'Comment not found'))
        }

        if(req.user.id !== comment.userId && !req.user.isAdmin){
            return next(errorHandler(403,'You are not allowed to edit this comment'))
        }

        const editedComment =await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content :req.body.content
            },{
                new:true
            }
        );
        res.status(200).json(editedComment);
    }catch(error){
        next(error);
    }
}



export const deleteComment =async (req,res,next) =>{
    try{
        const comment =await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404,'Comment not found'))
        }

        if(req.user.id !== comment.userId && !req.user.isAdmin){
            return next(errorHandler(403,'You are not allowed to delete this comment'))
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({message:"Comment deleted successfully"});
    }catch(error){
        next(error);
    }
}


export const getComments =async (req,res,next) =>{
    if(!req.user.isAdmin){
        return next(errorHandler(403,'You are not allowed to view comments'))
    }
    try{
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit =parseInt(req.query.limit) || 9;
        const sortDirection =req.query.sort === 'desc'? -1 : 1;

        const Comments =await Comment.find()
            .sort({createdAt:sortDirection})
            .skip(startIndex)
            .limit(limit);


        const totalComments =await Comment.countDocuments();

        const now =new Date();

        const onMonthAgo= new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()
        );

        const lastMonthComments =await Comment.countDocuments({
            createdAt:{$gte:onMonthAgo}
        });

        res.status(200).json({
            Comments,
            totalComments,
            lastMonthComments,
        });
    }catch(error){
        next(error);
    }
}