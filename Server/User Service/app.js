const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const db = require("./Database/dataBase_Config");
const userRegistration = require("./Routes/Api_Route");
const logger = require("./utils/Log/logger");
const globalErrorHandler = require('./utils/Error/globalErrorHandler')

app.use(cors());
app.use(express.json());
db();

app.get("/", (req, res) => {
  res.status(200).json({ message: "user service" });
});

app.use("/account", userRegistration);

app.all("*", (req,res,next) =>{
  const err = new Error(`Can't able to find ${req.originalUrl} on the server`);
  err.status = fail;
  err.statusCode = 404;
  next(err)
})

app.use(globalErrorHandler)

app.listen(process.env.port, () => {
  try {
    logger.info(`Server Running on port ${process.env.port}`);
  } catch (error) {
    logger.error(error);
  }
});
