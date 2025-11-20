const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const config = require("config");
const messages = require("../config/messages.json");

const postSignup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: messages.AUTH_DUPLICATE_EMAIL }] });
    }

    const avatar = normalize(
      gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      }),
      { forceHttps: true }
    );

    user = new User({
      name,
      email,
      avatar,
      password,
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    const jwt_secret = config.get(JWTSECRET) || process.env.JWTSECRET;
    const expires_in =
      config.get(TOKEN_EXPIRES_IN) || process.env.TOKEN_EXPIRES_IN;

    jwt.sign(payload, jwt_secret, { expiresIn: expires_in }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send(messages.SERVER_ERROR);
  }
};

module.exports = {
  postSignup,
};
