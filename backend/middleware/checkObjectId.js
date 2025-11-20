const mongoose = require('mongoose');

const messages = require('../config/messages.json');

const checkObjectId = (idToCheck) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck]))
    return res.status(400).json({ msg: messages.INVALID_MONGOOSE_ID });
  next();
};

module.exports = checkObjectId;
