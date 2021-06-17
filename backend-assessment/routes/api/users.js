const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const User = require('../../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route    POST api/users
//desc      Register user
//access    Public
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with atleast 6 characters').isLength({ min: 6 })
], 
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array()})
  }

  try {
    const { name, email, password } = req.body;
    //Check if user exists
    let user = await User.findOne({ email });

    if(user){
      return res.status(400).json({error: [{ msg: 'User already exists'}]})
    }

    user = new User({
      name,
      email,
      password
    })

    //Encrypt Password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    //Return Token
    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
      if(err) throw err;
        res.json({ token })
    })
    
  } catch (err) {
    console.error(err.message);

    res.status(500).json('Server Error');
  }
});

module.exports = router;