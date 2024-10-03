const express = require('express');
const apiService = express.Router();
const userService = require('../Controllers/Services');

apiService.get('/', (req,res)=>{
    res.status(200).json({message:"route"})
})

apiService.post('/signup',async (req,res) => {
    const {username,email,password} = req.body;

    try {
       const user = await userService.signup(username,email,password);
        res.status(200).json({message:"activation link send successfully",user})
    } catch (error) {
        res.status(400).json({message:"user already exists", error})
    }
})


module.exports = apiService;