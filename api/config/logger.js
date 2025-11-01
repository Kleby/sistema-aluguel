const winston = require("winston");
const path = require("path");
const fs = require("fs");

const myCustomLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    data: 3,
    info: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "red",
    warn: "yellow",
    data: "magenta",
    info: "green",
    debug: "blue",
  },
};

const logDir = "logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const customLogger = winston.createLogger({
  levels: myCustomLevels.levels,
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.simple(),
    winston.format.printf(
      (info) => `${info.timestamp}, ${info.level}, ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      level: "info",
    }),

    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    })
  ],
});

module.exports = customLogger;
