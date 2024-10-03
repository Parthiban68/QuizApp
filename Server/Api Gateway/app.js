const express = require('express');
const app = express();
require('dotenv').config();
const {createProxyMiddleware} = require('http-proxy-middleware')


const proxyConfig ={
    target : '',
    changeOrigin : true,
    onerror:(error,req,res,next) =>{
        console.error('proxy server error', error);
    }
}

const quiz = process.env.quiz;
const question = process.env.question;
const user = process.env.user;

app.use('/quiz', createProxyMiddleware({
    ...proxyConfig,
    target: quiz
}))

app.use('/question', createProxyMiddleware({
    ...proxyConfig,
    target : question
}))

app.use('/user', createProxyMiddleware({
    ...proxyConfig,
    target : user
}))

app.use('/', (req,res) => {
    res.status(200).json({message: "proxy server"})
})

app.listen(process.env.port, () => {
    try {
        console.log(`Api Gateway Server Running on port ${process.env.port}`);
        
    } catch (error) {
        console.error(error);
        
    }
})