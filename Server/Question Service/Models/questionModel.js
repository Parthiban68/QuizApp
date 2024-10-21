const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  catoery: { type: String, require: true },
  question: { type: String, require: true },
  option1: { type: String, require: true },
  option2: { type: String, require: true },
  option3: { type: String, require: true },
  option4: { type: String, require: true },
  answer: { type: String, require: true },
});

const questionModel = mongoose.model("questions", questionSchema);

exports.model = questionModel;
