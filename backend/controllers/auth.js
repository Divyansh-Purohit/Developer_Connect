const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");
const messages = require("../config/messages.json");

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(messages.SERVER_ERROR);
  }
};

const postLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: messages.AUTH_INCORRECT_CRED }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: messages.AUTH_INCORRECT_CRED }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const jwt_secret = config.get("JWTSECRET") || process.env.JWTSECRET;
    const expires_in =
      config.get("TOKEN_EXPIRES_IN") || process.env.TOKEN_EXPIRES_IN;

    jwt.sign(payload, jwt_secret, { expiresIn: expires_in }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(messages.SERVER_ERROR);
  }
};

module.exports = {
  getUser,
  postLogin,
};
