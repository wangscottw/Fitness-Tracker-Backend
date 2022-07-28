/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const {getUserByUsername} = require("../db")
const jwt = require("jsonwebtoken");
const {JWT_SECRET = "neverTell"} = process.env

// POST /api/users/register

// POST /api/users/login
router.post("/login", async (req, res, next) => {
    console.log(req.body, "@@@@@@@")
   const {password, username} = req.body
    console.log(req.body);
  if (!username || !password) {
    next({
        name: "missing credentials",
        message: "Please enter both username and password"

  }) 
}
try {
    const user = await getUserByUsername(username)
    console.log(user, "%%%%%%%")
    if (user && user.password == password) {
        const token = jwt.sign({
            id: user.id,
            username: username,
    }, JWT_SECRET, {expiresIn: '2W'})
    res.send({message:"You are logged in", token})
    
    return user
    }
    else {
        next({
            name: "Incorrect credientials", 
            message: "Incorrect username or password"
        })

    }
}
catch (error) {
    console.log(error);
    next(error)
} 
})

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
