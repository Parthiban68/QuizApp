const questionModel = require("../../Models/questionModel");

exports.findTheQuestion = async (question) => {
  return await questionModel.findOne({question});
};

exports.saveQuestion = async (questionData) => {
  const question = new questionModel({
    catoery: questionData.catoery,
    question: questionData.question,
    option1: questionData.option1,
    option2: questionData.option2,
    option3: questionData.option3,
    option4: questionData.option4,
    answer: questionData.answer,
  });
  return await question.save();
};


exports.findQuestion = async(_id,updatedQuestion) =>{
  return await questionModel.findByIdAndUpdate(_id,updatedQuestion,{new:true})
}

exports.findQuestionandDelete = async (_id) =>{
  return await questionModel.findByIdAndDelete(_id);
}