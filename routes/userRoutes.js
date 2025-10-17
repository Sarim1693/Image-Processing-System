const express=require('express');
const router=express.Router();
const User=require('./../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config();
router.post('/signup', async(req , res)=>{
    try{
        const {username, password}=req.body;
        if(!username || !password) return res.status(400).json({err :"Please Provide all Credentials"});
        let user= await User.findOne({username});
        if(user) return res.status(409).json({message: "Username already taken"});
        
        const newPerson= new User({username, password});
        const response= await newPerson.save();
        res.status(200).json({message: "User Saved Successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({err: "Internal Server Error"});
    }
});

router.post('/login', async(req, res)=>{
    try{
        const {username, password}=req.body;
        
        const user= await User.findOne({username});
        if(!user){
            return res.status(400).json({err: "username not found"});
        }
        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({err: "Invalid Password"});
        }
        const token= jwt.sign(
            {user_id:user._id, username:user.username},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        );
        res.status(200).json({
            message:"Login Successfull",
            token
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({err: "Internal Server Error"});
    }
});
module.exports=router;