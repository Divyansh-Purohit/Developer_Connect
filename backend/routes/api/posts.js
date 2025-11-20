const { check } = require("express-validator");
const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const checkObjectId = require("../../middleware/checkObjectId");

const routes = require("../../config/routes.json");
const postController = require("../../controllers/post.js");

router.post(
  routes.CREATE_POST,
  auth,
  check("text", "Text is required").notEmpty(),
  postController.createPost
);

router.get(routes.GET_POSTS, auth, postController.getPosts);

router.get(routes.GET_POST, auth, checkObjectId("id"), postController.getPost);

router.delete(
  routes.DELETE_POST,
  [auth, checkObjectId("id")],
  postController.deletePost
);

router.put(
  routes.LIKE_POST,
  auth,
  checkObjectId("id"),
  postController.likePost
);

router.put(
  routes.UNLIKE_POST,
  auth,
  checkObjectId("id"),
  postController.unlikePost
);

router.post(
  routes.POST_COMMENT,
  auth,
  checkObjectId("id"),
  check("text", "Text is required").notEmpty(),
  postController.postComment
);

router.delete(routes.DELETE_COMMENT, auth, postController.deleteComment);

module.exports = router;
