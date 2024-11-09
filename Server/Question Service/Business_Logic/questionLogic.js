const questionRepo = require("../Database/Repository/questionRepo");

exports.questionStore = async (questionData) => {
  const { question } = questionData;

  const questionExists = await questionRepo.findTheQuestion(question);
  console.log(questionExists);

  if (questionExists) {
    const error = new Error("Question Already Exists", 402);
    throw error;
  }
  return await questionRepo.saveQuestion(questionData);
};

exports.updateQuestion = async (_id, updatedQuestion) => {
  const updatevalue = await questionRepo.findQuestion(_id, updatedQuestion);

  if (!updatevalue) {
    const error = new Error("can't able to update the question", 402);
    throw error;
  }
  return updatevalue;
};

exports.deleteQuestion = async(_id) =>{
   const deletedvalue = await questionRepo.findQuestionandDelete(_id);

   if(!deletedvalue){
   const error = new Error("can't able to delete the question", 402);
    throw error;
   }
   return
}