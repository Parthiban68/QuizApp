const mongoose = require("mongoose");
const logger = require("../utils/Log/logger");

const db = async () => {
  const dbUrl = process.env.db_url;
  try {
    await mongoose.connect(dbUrl);

    logger.info("MongoDb Connected successfully");
    mongoose.connection.on("error", (err) => {
      logger.error("Connection Error : ", err);
    });
  } catch (error) {
    logger.error(error);
  }
};

module.exports = db;
