const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000





//Starting the server
app.listen(PORT,()=>{
    console.log(`Server is up and running on PORT ${PORT}`);
});