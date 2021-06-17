const express = require('express');
const router = express.Router();

//@route    GET api/blogs
//desc      Test Route
//access    Public
router.get('/', (req, res) => res.send('Users Route Working...'));

module.exports = router;