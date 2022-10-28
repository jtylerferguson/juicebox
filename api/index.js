const express = require('express');
const postsRouter = require('./posts');
const tagsRouter = require('./tags');
const apiRouter = express.Router();

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter,);
apiRouter.use('/posts', postsRouter)
apiRouter.use('/tags', tagsRouter)

module.exports = apiRouter;