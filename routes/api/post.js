const express = require('express')
const router = express.Router();
const Post = require('../../models/post')
const MSGS = require('../../messages')
const auth = require('../../middleware/auth')

// @route    GET /post
// @desc     LIST post
// @access   Private
router.get('/',auth ,async (req, res, next) => {
    try {
        const post = await Post.aggregate([
           {
               $project: {
                   _id: '$_id',
                   author: '$author',
                   author_picture: '$author.picture',
                   content: '$content',
                   count_dislikes: {$size: '$dislikes'},
                   count_likes: {$size: '$likes'},               
              }
            }
       ])
       await Post.populate(post, {path: "author "});
       res.json(post)
    } catch (err) {
      res.status(500).send({ "error": err.message })
    }
})

// @route    POST /post
// @desc     create post
// @access   Private
router.post('/', auth,async (req, res, next) => {
    try {
        req.body.author = req.user.id
        let post = new Post(req.body)
        await post.save()
        if (post.id) {
          res.json(post);
        }
    } catch (err) {
      res.status(500).send({ "error": MSGS.GENERIC_ERROR })
    }
})

// @route    DELETE /post
// @desc     DELETE post
// @access   Private
router.delete('/', auth, async (req, res, next) => {
    try {
      const post_id = req.body.id
      const post = await Post.findOneAndDelete({ _id : post_id, author: req.user.id })
      if (post) {
        res.json(post)
      } else {
        res.status(404).send({ "error": "user not found" })
      }
    } catch (err) {
      res.status(500).send({ "error": err.message })
    }
  })


module.exports = router;