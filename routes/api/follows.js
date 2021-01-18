const express = require('express')
const router = express.Router();
const User = require('../../models/user')
const MSGS = require('../../messages')
const auth = require('../../middleware/auth')

// @route    GET /friends
// @desc     LIST friends
// @access   Private
router.get('/', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('follows')
        res.json(user.follows)
    } catch (err) {
      res.status(500).send({ "error": MSGS.GENERIC_ERROR })
    }
})


router.post('/', auth, async(req, res, next) => {
    try {
        data = req.body
        let user = await User.findById(req.user.id)
        user.follows.push(req.body.id)
        await user.save().then(t => t.populate({path: 'follows', select: 'name picture username'}).execPopulate())
        if (user.id){
            res.json(user.follows)
        }
    } catch (err) {
      res.status(500).send({ "error": err.message })
    }
})

router.delete('/', auth, async(req, res, next) => {
    try {
        data = req.body
        const user = await User.findById(req.user.id).populate('follows')
        user.follows.pull(req.body.id)
        await user.save()
        if (user.id){
            res.json(user.follows)
        }
    } catch (err) {
      res.status(500).send({ "error": err.message })
    }
})

module.exports = router;

