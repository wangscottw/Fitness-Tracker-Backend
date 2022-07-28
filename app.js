require("dotenv").config()
const express = require("express")
const app = express()
require("dotenv").config()
var cors = require('cors')

// Setup your Middleware and API Router here
const morgan = require('morgan')

app.use(cors())

app.use(morgan('dev'))

app.use(express.json())

app.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
    
    next();
  });

const router = require('./api')
app.use('/api', router)

module.exports = app;
