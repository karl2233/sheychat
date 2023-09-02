const User = require('../models/userModel');
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register",async (req,res)=>{
    try{ 
        console.log(req.body);
        const user = await User.findOne({email:req.body.email});
        if(user){
            return res.send({
                success:false,
                message:"User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        req.body.password = hashedPassword;
        console.log(req.body);
        const newUser = new User(req.body);
        newUser.save();
    }catch(error){
        res.send({
            message:error.message,
            success:false,
        });

    }
});

router.post("/login",async (req,res)=>{
try{
 const user = await User.findOne({email:req.body.email});
 if(!user){
    return res.send({
        success:false,
        message:"User does not exist"
    });
 }

const validPassword = await bcrypt.compare(
    req.body.password,
    user.password
);
if(!validPassword){
    return res.send({
        success:false,
        message:"Invalid password"
    });
}

const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{
    expiresIn: "1d",
});
}catch(error){
    res.send({
        message:error.messsage,
        success:false
    })
}
});

router.get("/get-current-user",authMiddleware,async (req,res)=>{
try{
    const user = await User.findOne({_id:req.body.userId});
    res.send({
        success:true,
        message:"User fetched successfully",
        data:user
    });
}catch(error){
    res.send({        
        message:error.message,
        success:false,
    });
}
})

module.exports = router;