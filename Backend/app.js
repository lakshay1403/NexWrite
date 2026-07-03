const express = require('express');
const userRouter = require('./route/UserRouter');
const connectDB = require('./utils/connectDB');
const app = express();

require('dotenv').config();

connectDB();

const PORT = process.env.PORT || 3000


//Middlewares
app.use(express.json());   //pass incoming json data


app.use('/api/v1/users', userRouter);


//Starting the server
app.listen(PORT,()=>{
    console.log(`Server is up and running on PORT ${PORT}`)
});

console.log("this is executed");