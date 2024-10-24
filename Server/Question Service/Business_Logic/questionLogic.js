const questionRepo = require('../Database/Repository/questionRepo')

exports.questionStore = async(questionData) =>{
    
 const {question} = questionData;

 const questionExists = await questionRepo.findTheQuestion(question);
console.log(questionExists);

 if(questionExists){
    const error = new Error("Question Already Exists", 402);
    throw(error);
 }
 return await questionRepo.saveQuestion(questionData);
}