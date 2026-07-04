const express = require('express');
const userRouter = require('./route/UserRouter');
const connectDB = require('./utils/connectDB');
const errorHandler = require('./middlewares/errorMiddleware');
const app = express();
const cookieParser = require('cookie-parser');

require('dotenv').config();

connectDB();

const PORT = process.env.PORT || 3000


//Middlewares
app.use(express.json());   //pass incoming json data
app.use(cookieParser());     // pass the cookie automatically

app.use('/api/v1/users', userRouter);

//--Error handling middleware---
app.use(errorHandler);


//Starting the server
app.listen(PORT,()=>{
    console.log(`Server is up and running on PORT ${PORT}`)
});

console.log("this is executed");