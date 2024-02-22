import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
export const signup =async(req,res,next) =>{
    const {username,email,password} =req.body;


    function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
      }


    if(!username|| !email || !password || username=== '' || email === '' || password === ''){
       return next(errorHandler(400,'All fields are required'))
    }
    if(validateEmail(email) === false){
        return next(errorHandler(400,'Valid Email id is required'))
    }

    const hashedPassword =bcryptjs.hashSync(password,10);
    const newUser = new User({
        username,
        email,
        password:hashedPassword,
    })

    try{
        await newUser.save();
        res.json('Signup successful')
    }catch(error){
        next(error)
    }
}