const express = require('express');
const usersRouter = express.Router();

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  res.send({ message: 'hello from /users!' });
});

module.exports = usersRouter;