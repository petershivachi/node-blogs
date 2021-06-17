const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const User = require('../../models/Users');
const bcrypt = require('bcryptjs')

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

    res.send('User Registered'); 
    
  } catch (err) {
    console.error(err.message);

    res.status(500).json('Server Error');
  }
});

module.exports = router;