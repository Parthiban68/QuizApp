const express = require("express");
require("dotenv").config();
const db = require('./Database/questionDbConfig')
const route = require('./Api/questionApi')
const bodyparser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyparser.json());

db();


app.get("/", (req, res) => {
  res.status(200).json({ message: "Question Service" });
});

app.use("/add", route)

app.listen(process.env.port, () => {
  try {
    console.log(`Server running on port ${process.env.port} `);
  } catch (error) {
    console.log(error);
  }
});
