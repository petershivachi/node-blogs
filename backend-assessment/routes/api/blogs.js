const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Blog = require("../../models/Blog");

//@route    POST api/blogs
//desc      Create a blog
//access    Private
router.post(
  "/",
  [
    auth,
    [
      check("title", "Please enter a blogs title").not().isEmpty(),
      check("body", "Please add a body to the blog").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newBlog = new Blog({
        title: req.body.title,
        body: req.body.body,
        name: user.name,
        user: req.user.id,
      });

      const blog = await newBlog.save();

      res.json(blog);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    GET api/blogs
//desc      Endpoint to get all blog posts
//access    Private
router.get('/', auth, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({date: -1});

    res.json(blogs)
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
    
  }
});



//@route    GET  api/blogs/:id
//@desc     Get a single blog by its id
//@accesss  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if(!blog){
      return res.status(400).json({msg: 'Blog not found'});
    }

    res.json(blog)
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId'){
      return res.status(400).json({msg: 'Blog not found'});
    }
    res.status(500).send('Server Error');
    
  }
});


//@route    DELETE  api/blogs/:id
//@desc     Delete a blog
//@accesss  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if(!blog){
      return res.status(400).json({msg: 'Blog not found'});
    }

    if(blog.user.toString() !== req.user.id){
      return res.status(401).json({ msg: 'Unauthorized user'});
    }

    await blog.remove();

    res.json('Blog removed')
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId'){
      return res.status(400).json({msg: 'Blog not found'});
    }
    res.status(500).send('Server Error');
    
  }
});




module.exports = router;
