const express = require('express')
const router = express.Router();
const User = require('../../models/user')
const MSGS = require('../../messages')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth')
const file = require('../../middleware/file')
const send_email = require('../../service/mail')

// @route    GET /users
// @desc     LIST users
// @access   Private
router.get('/', auth, async (req, res, next) => {
    try {
      const user = await User.find({})
      res.json(user)
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ "error": 'Erro!' })
    }
  })

// @route    GET /users/:id
// @desc     get one users
// @access   Private
router.get('/:id', auth, async (req, res, next) => {
  try {
    const id = req.params.id
    const user = await User.findById(id)
    if(user){
      res.json(user)
    }else{
      res.status(404).send({ "error": MSGS.USER404 }) 
    }
    
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": 'Erro!' })
  }
})

// @route    PATCH /user/:userId
// @desc     PARTIAL EDIT user
// @access   Private
router.patch('/:userId', auth,[
  check('email', MSGS.VALID_EMAIL).isEmail()
],file, async (request, res, next) => {
  try {
    const id = request.params.userId
    const salt = await bcrypt.genSalt(10)
    let bodyRequest = request.body

    if (request.body.picture_name){
      bodyRequest.picture = `user/${request.body.picture_name}`
    }

    if(bodyRequest.password){
      bodyRequest.password = await bcrypt.hash(bodyRequest.password, salt)
    }
    const update = { $set: bodyRequest }
    const user = await User.findByIdAndUpdate(id, update, { new: true })
    if (user) {
      res.send(user)
    } else {
      res.status(404).send({ error: MSGS.USER404 })
    }
  } catch (err) {
    res.status(500).send({ "error": err.message })
  }
})

// @route    POST /user
// @desc     create user
// @access   Public
router.post('/',[
  check('email', MSGS.VALID_EMAIL).isEmail(),
  check('name', MSGS.USER_NAME_REQUIRED).not().isEmpty(),
  check('username', MSGS.USERNAME_REQUIRED).not().isEmpty(),
  check('password', MSGS.PASSWORD_VALIDATED).isLength({ min: 6 })
], file, async (req, res, next) => {
  try {
    let password  = req.body.password

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    } else {
      let usuario = new User(req.body)
      if (req.body.picture_name){
        usuario.picture = `user/${req.body.picture_name}`
      }
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(password, salt);
      await usuario.save()
      if (usuario.id) {
        send_email(usuario)
        res.json(usuario);
      }
    }
  } catch (err) {
    res.status(500).send({ "error": err.message })
  }
})

module.exports = router;