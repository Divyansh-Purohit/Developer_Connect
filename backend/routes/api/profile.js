const { check } = require("express-validator");
const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const checkObjectId = require("../../middleware/checkObjectId");
const routes = require("../../config/routes.json");
const profileController = require("../../controllers/profile.js");

router.get(routes.GET_MY_PROFILE, auth, profileController.getMyProfile);

router.post(
  routes.UPDATE_MY_PROFILE,
  auth,
  check("status", "Status is required").notEmpty(),
  check("skills", "Skills is required").notEmpty(),
  profileController.updateMyProfile
);

router.get(routes.GET_PROFILES, profileController.getProfiles);

router.get(
  routes.GET_USER_PROFILE,
  checkObjectId("user_id"),
  profileController.getUserProfile
);

router.delete(routes.DELETE_PROFILE, auth, profileController.deleteMyProfile);

router.put(
  routes.PUT_EXPERIENCE,
  auth,
  check("title", "Title is required").notEmpty(),
  check("company", "Company is required").notEmpty(),
  check("from", "From date is required and needs to be from the past")
    .notEmpty()
    .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  profileController.addExperience
);

router.delete(
  routes.DELETE_EXPERIENCE,
  auth,
  profileController.deleteExperience
);

router.put(
  routes.PUT_EDUCATION,
  auth,
  check("school", "School is required").notEmpty(),
  check("degree", "Degree is required").notEmpty(),
  check("fieldofstudy", "Field of study is required").notEmpty(),
  check("from", "From date is required and needs to be from the past")
    .notEmpty()
    .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  profileController.addEducation
);

router.delete(routes.DELETE_EDUCATION, auth, profileController.deleteEducation);

router.get(routes.GET_GITHUB_USERNAME, profileController.getGithubUsername);

module.exports = router;
