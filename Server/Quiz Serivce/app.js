const express = require('express');
const app = express();
require('dotenv').config();
const bodyparser = require('body-parser');
const cors =  require('cors');


app.use(cors());
app.use(bodyparser.json());



app.get('/',(req,res)=>{
    res.status(200).json({message: "Quiz Service"})
})


app.listen(process.env.port, () => {
    try {
        console.log(`server Running on port ${process.env.port}`);
        
    } catch (error) {
        console.error(error);
        
    }
})