const express = require("express")
const postsRouter = express.Router()
const { getAllPosts, createPost} = require("../db")
const { requireUser } = require("./utils")

postsRouter.post("/", requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body
    console.log(req.user, "this is our user")

    const tagArr = tags.trim().split(/\s+/)
    const postData = { authorId: req.user.id, title, content }

    // only send the tags if there are some to send
    if (tagArr.length) {
        postData.tags = tagArr
    }

    try {
        // add authorId, title, content to postData object
        post = await createPost(postData)
        // const post = await createPost(postData);
        // this will create the post and the tags for us
        // if the post comes back, res.send({ post });
        if (post) {
            res.send(post)
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})

postsRouter.use((req, res, next) => {
    console.log("A request is being made to /users")

    next() // THIS IS DIFFERENT
})

// UPDATE
postsRouter.get("/", async (req, res) => {
    const posts = await getAllPosts()

    res.send({
        posts,
    })
})

module.exports = postsRouter
