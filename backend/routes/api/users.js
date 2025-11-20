const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const routes = require("../../config/routes.json");
const userController = require("../../controllers/user.js");

router.post(
  routes.POST_SIGNUP,
  check("name", "Name is required").notEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  userController.postSignup
);

module.exports = router;
