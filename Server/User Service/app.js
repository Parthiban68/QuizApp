const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const db = require("./Database/dataBase_Config");
const userRegistration = require("./Routes/Api_Route");

app.use(cors());
app.use(express.json());
db();

app.get("/", (req, res) => {
  res.status(200).json({ message: "user service" });
});

app.use("/account", userRegistration);

app.listen(process.env.port, () => {
  try {
    console.log(`Server Running on port ${process.env.port}`);
  } catch (error) {
    console.error(error);
  }
});
