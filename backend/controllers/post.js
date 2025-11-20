const { validationResult } = require("express-validator");

const User = require("../models/User");
const Post = require("../models/Post");
const messages = require("../config/messages.json");

const createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select("-password");

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    res.status(500).send(messages.SERVER_ERROR);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: messages.NOT_FOUND });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: messages.UNAUTHORIZED });
    }

    await post.remove();
    res.json({ msg: messages.POST_DELETED });
  } catch (err) {
    res.status(500).send(messages.SERVER_ERROR);
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send(messages.SERVER_ERROR);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: messages.NOT_FOUND });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);

    res.status(500).send(messages.SERVER_ERROR);
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: messages.POST_ALREADY_LIKED });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();
    return res.json(post.likes);
  } catch (err) {
    res.status(500).send(messages.SERVER_ERROR);
  }
};

const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: messages.POST_NOT_LIKED_YET });
    }

    post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    await post.save();
    return res.json(post.likes);
  } catch (err) {
    res.status(500).send(messages.SERVER_ERROR);
  }
};

const postComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.id);

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    };

    post.comments.unshift(newComment);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    res.status(500).send(messages.SERVER_ERROR);
  }
};

const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: msg.NOT_FOUND });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: messages.UNAUTHORIZED });
    }

    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await post.save();
    return res.json(post.comments);
  } catch (err) {
    return res.status(500).send(messages.SERVER_ERROR);
  }
};

module.exports = {
  createPost,
  deletePost,
  getPosts,
  getPost,
  likePost,
  unlikePost,
  postComment,
  deleteComment,
};
