const jwt = require('jsonwebtoken');
const config = require('config');

const messages = require('../config/messages.json');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: messages.NO_TOKEN });
  }
  try {
    const jwt_secret = config.get(JWTSECRET) || process.env.JWTSECRET;
    jwt.verify(token, jwt_secret, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: messages.TOKEN_INVALID });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error(messages.MIDDLEWARE_ERROR);
    res.status(500).json({ msg: messages.SERVER_ERROR });
  }
};

module.exports = auth;
