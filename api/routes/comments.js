const router = require("express").Router()
const Comment = require("../models/Comment")
const User = require("../models/User");

//create new comment
router.post("/", async(req,res)=>{
    const newComment = new Comment(req.body)
    try {
        const savedComment = await newComment.save() 
        res.status(200).json(savedComment)
    } catch (err) {
        res.status(500).json(err)
    }
})

//get all comments in a post
router.get("/:postId", async(req,res)=>{
    try {
        const comments = await Comment.find(
            {postId:req.params.postId}
        )
        res.status(200).json(comments)
    } catch (err) {
        res.status(500).json(err)
    }
})

//get all commenters of a post
router.get("/commenters/:postId", async(req,res)=>{
    try {
        const comments = await Comment.find(
            {postId:req.params.postId}
        )
        const commenters = await Promise.all(comments.map((c)=>{
            return User.findById(c.senderId)
    }))
        res.status(200).json(commenters)
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;