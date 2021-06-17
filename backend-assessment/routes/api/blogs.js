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

module.exports = router;
