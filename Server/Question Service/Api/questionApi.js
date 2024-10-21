const express = require('express');
const questionRoute = express.Router();
const questionLogic = require("../Business_Logic/questionLogic")

questionRoute.get("/",(req,res)=>{
    res.status(200).json({message:"question route"})
})

questionRoute.post("/question",async (req,res)=>{
    const questionData = req.body;
    try {
        const response = await questionLogic.questionStore(questionData);
        res.status(200).json({message:"Question Stored Successfully"});
    } catch (error) {
        res.status(400).json({message:"cant't able to stored question"})
    }
})