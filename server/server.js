const express = require('express');
const dbConfig = require("./config/dbConfig");
const usersRoute = require("./routes/usersRoute");
var bodyParser = require('body-parser');

const app = express();

require('dotenv').config();


const port = process.env.PORT || 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use("/api/users",usersRoute);
app.listen(port,()=>{console.log(`Server running on port ${port}`)});