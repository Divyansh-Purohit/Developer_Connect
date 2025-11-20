const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const routes = require("../../config/routes.json");
const authController = require("../../controllers/auth.js");

router.get(routes.GET_USER, auth, authController.GET_USER);

router.post(
  routes.POST_LOGIN,
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
  authController.POST_LOGIN
);

module.exports = router;
