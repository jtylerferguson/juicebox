const express = require('express');
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next(); // THIS IS DIFFERENT
});

const { getAllTags, getPostsByTagName

} = require('../db');


// UPDATE
tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags
  });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const { tagName } = req.params;
    console.log(tagName)
    // read the tagname from the params

    try {
        const posts = await getPostsByTagName(tagName)
       
        res.send ({posts: posts})
      // use our method to get posts by tag name from the db
      // send out an object to the client { posts: // the posts }
    } catch ({name, message}) {
        next(name, message)
      // forward the name and message to the error handler
    }
  });


module.exports = tagsRouter;