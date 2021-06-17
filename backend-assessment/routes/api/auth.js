const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');

//@route    GET api/auth
//desc      Authenticate User
//access    Private
router.get('/', auth, async (req, res) => {
  try{
    const user = await User.findById(req.user.id).select('-password');

    res.json(user);
  }catch(err){
    console.log(err.message);
    res.status(500).send('Server error');
  }
});


//@route    POST  api/users
//@desc     Authenticate user & get token
//@accesss  Public
router.post('/', [
  check('email', "Provide a valid email")
  .isEmail(),
  check('password', 'Password is required')
  .exists()
], 
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body

  try{
    //check if no user exists
    let user = await User.findOne({ email });

    if(!user){
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }]});
    }

    //Check password match
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
      res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }]});
    }

  
    //return jwt
    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(payload, 
      config.get('jwtSecret'),
      { expiresIn: 3600 }, 
      (err, token) => {
        if(err) throw err;
        res.json({ token })
      })
  }catch(err){
    console.error(err.message);
    //res.status(500).send('Server Error')
  }
});

module.exports = router;