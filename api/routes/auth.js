const { response } = require('express')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt') 
const User = require("../models/user")

//Register
router.post("/register", async(req,res) => {
    const {password} = req.body
    const hash = await hashPassword(password)
    const user =  await User.create({...req.body, password : hash})
    if(!user){
        res.json("not able to create")
        return 
    }
    res.status(201).json({success:true, data: user})
})


//login
router.post("/login", async(req,res) => {
   try{
    const {email, password} = req.body
   
    const user = await User.findOne({email : email})
    if(!user){
        res.status(404).json({message:"user not found"})
        return
    }

    const isPasswordMatch = await validPassword(password, user.password)
    if(!isPasswordMatch){
        res.status(400).json({message:"password is incorrect"})
        return  
    }

    res.status(200).json(user)

   }
   catch(err){
        res.status(500).json(err)
   }
})




const hashPassword = async(password) =>{
    const salt = await  bcrypt.genSalt(10)
    const result = await bcrypt.hash(password, salt)
    return result
}

const validPassword = async(password, savedPassword) => {
    const result = await bcrypt.compare(password, savedPassword)
    return result
}

module.exports = router
