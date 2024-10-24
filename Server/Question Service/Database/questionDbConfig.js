const mongoose = require("mongoose");

const db = async () =>{
    try {
    await mongoose.connect(process.env.db_url);
       console.log("Db connected Successfully");
        mongoose.connection.on('error',(err)=>{
            console.log("unable to connect db :", err);   
        })
    } catch (error) {
        console.log(error);  
    }
}

module.exports = db;