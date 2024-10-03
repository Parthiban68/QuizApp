const mongoose = require('mongoose');

const db = async () =>{
    const dbUrl = process.env.db_url
 try {
   await mongoose.connect(dbUrl);
   
        console.log('MongoDb Connected successfully');

    mongoose.connection.on('error', (err) => {
        console.error('Connection Error : ', err);
        
    })
 } catch (error) {
    console.error(error);
 }
}

module.exports = db