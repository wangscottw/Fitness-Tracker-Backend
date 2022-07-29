/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { getUserByUsername, createUser, getUserById } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both username and password",
    });
  }
  if (password.length > 8) {
    next({
      name: "PassswordLengthError",
      message: "Password is not long enough",
    });
  }
  try {
    const _user = await getUserByUsername(username);
    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    }

    const user = await createUser({
      username,
      password,
    });
    console.log(user, '!!!!!!')
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
  } catch (error) {
    console.log(error)
    next(error);
  }
});

// POST /api/users/login
router.post("/login", async (req, res, next) => {
  console.log(req.body, "@@@@@@@");
  const { password, username } = req.body;
  if (!username || !password) {
    next({
      name: "missing credentials",
      message: "Please enter both username and password",
    });
  }
  try {
    const user = await getUserByUsername(username);
    console.log(user, "%%%%%%%");
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
router.get('/me', async (req,res,next)=> {
  const prefix = 'Bearer '
  const auth = req.header('Authorization')

  if (!auth) {
    next()
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length)
    try {
    const {id} = jwt.verify(token, JWT_SECRET)

    if (id) {
      req.user = await getUserById(id)
      
    }
  } catch ({name, message}) {
    next({name, message})
  }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization must start with ${prefix}`
    })
  }
})

// GET /api/users/:username/routines

module.exports = router;
