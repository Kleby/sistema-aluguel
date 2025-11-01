const logger = require("../config/logger.js");
const morgan = require("morgan");

const morganStream = {
  write: (message) => {
    logger.data(message.trim());
  },
};

module.exports = morgan(
  ":method :url :status :response-time ms - :res[content-length]",
  {
    stream: morganStream,
  }
);
