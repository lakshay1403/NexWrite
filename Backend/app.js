const express = require('express');
const userRouter = require('./route/UserRouter');
const app = express();

const PORT = process.env.PORT || 5000


app.use('/api/v1/users', userRouter);


//Starting the server
app.listen(PORT,()=>{
    console.log(`Server is up and running on PORT ${PORT}`);
});