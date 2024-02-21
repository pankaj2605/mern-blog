import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
export const signup =async(req,res) =>{
    const {username,email,password} =req.body;


    function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
      }


    if(!username|| !email || !password || username=== '' || email === '' || password===''){
        return res.status(400).json({message:"All Field are required"})
    }
    if(validateEmail(email) === false){
        return res.status(400).json({message:"Valid Email id is required"})
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
        res.status(500).json({message:error.message})
    }
    console.log(req.body);
}