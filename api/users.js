/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { getUserByUsername, createUser, getUserById } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {requireUser} = require("./utils")

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both username and password",
    });
  }
  if (password.length < 8) {
    next({
      name: "PassswordLengthError",
      message: "Password Too Short!",
    });
  }
  try {
    const _user = await getUserByUsername(username);
    if (_user) {
      next({
        name: "UserExistsError",
        message: `User ${_user.username} is already taken.`,
      });
    } else {
        const user = await createUser({
            username,
            password,
          });
          console.log(user, '!!!!!!')
          if (user) {
            const token = jwt.sign(
                {
                  id: user.id,
                  username,
                },
                JWT_SECRET,
                {
                  expiresIn: "2w",
                }
              );
              res.send({ message: "Thank you for signing up!", token, user});
          } else {
            next({
                name: "UserCreationError",
                message: "Error creating user",
            })
          }
          
    }

    
  } catch (error) {
    next(error);
  }
});

// POST /api/users/login
router.post("/login", async (req, res, next) => {
  const { password, username } = req.body;
  if (!username || !password) {
    next({
      name: "missing credentials",
      message: "Please enter both username and password",
    });
  }
  try {
    const user = await getUserByUsername(username);
    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          username: username,
        },
        JWT_SECRET,
        { expiresIn: "2W" }
      );
      res.send({ message: "You are logged in", token, user });
    } else {
      next({
        name: "Incorrect credientials",
        message: "Incorrect username or password",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/users/me
router.get('/me', requireUser, async (req,res,next)=> {
 try {
res.send(req.user)
 } catch (error) {
  next(error)
 }
})

// GET /api/users/:username/routines

// router.get('/:username/routines', async (req,res,next)=> {
// try {
//     const user = await getPublicRoutinesByUser (req.params.username)
//     if (user && user) {

//     }
// }

// } catch (err) {

// })


module.exports = router;
