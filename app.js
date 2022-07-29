const express = require("express")
const app = express()
const cors = require('cors')
require("dotenv").config()

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

app.get('*', (req, res) => {
  res.status(404).send({error: '404 - Not Found', message: 'No route found for the requested URL'});
});

// error handling middleware
app.use((error, req, res, next) => {
  if(res.statusCode < 400) res.status(500);
  res.send({error: error.message, name: error.name, message: error.message});
});

module.exports = app;
