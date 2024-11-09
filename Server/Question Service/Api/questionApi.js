const express = require('express');
const questionRoute = express.Router();
const questionLogic = require("../Business_Logic/questionLogic")

//test API
questionRoute.get("/",(req,res)=>{
    res.status(200).json({message:"question route"})
})

questionRoute.post("/question",async (req,res)=>{
    let questionData = req.body;
    try {
        await questionLogic.questionStore(questionData);
        res.status(200).json({message:"Question Stored Successfully"});
    } catch (error) {
        res.status(400).json({message:"cant't able to stored question"})
    }
})


questionRoute.put('/update', async(req,res)=>{
    const _id = req.params;
    const updatedQuestion = req.body;
    try {
        await questionLogic.updateQuestion(_id,updatedQuestion);
        res.status(200).json({message:"Question updated Successfully"});
    } catch (error) {
        res.status(400).json({message:"cant't able to update the question"})
    }
})

questionRoute.delete('/delete',async(req,res)=>{
    const _id = req.params;
    try {
        await questionLogic.deleteQuestion(_id);
        res.status(200).json({message:"Question deleted Successfully"});
    } catch (error) {
        res.status(400).json({message:"cant't able to delete the question"})
    }
})

module.exports = questionRoute