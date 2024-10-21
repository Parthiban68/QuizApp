const questionModel = require('../../Models/questionModel');

exports.findTheQuestion = async(question) =>{
    return await questionModel.findOne({question});
}

exports.saveQuestion = async(questionData) =>{
    const question = new questionModel({
        
    })
    return await question.save();
}