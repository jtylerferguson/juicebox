const express = require('express');
const usersRouter = express.Router();

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next(); // THIS IS DIFFERENT
});

const { getAllUsers

} = require('../db');


// UPDATE
usersRouter.get('/', async (req, res) => {
  const users = await getAllUsers();

  res.send({
    users
  });
});

const jwt = require('jsonwebtoken');
const { getUserByUsername

} = require('../db');
const { JWT_SECRET } = process.env;
// const token = jwt.sign({ id: 3, username: 'joshua' }, 'server secret');
// const recoveredData = jwt.verify(token, 'server secret');
usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })
      const recoveredData = jwt.verify(token, JWT_SECRET);
      res.send({ message: "you're logged in!", token, });
      return recoveredData
      // create token & return to user
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
});

module.exports = usersRouter;