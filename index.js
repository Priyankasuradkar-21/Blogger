const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const PORT = process.env.PORT;
const config = process.env.NODE_ENV == 'test' ? require('./database/testingDB') : require('./database/mongoDB');


const blogRouter = require("./routes/blogRouter");
const userRouter = require("./routes/userRouter");

app.use(bodyParser.json());
app.use(blogRouter);
app.use(userRouter);

app.get('/', (req, res) => {
    console.log('Server is Running');
})
app.listen(PORT, () => {
    console.log(`Server is Listening on PORT ${PORT}`);
})

module.exports = app;