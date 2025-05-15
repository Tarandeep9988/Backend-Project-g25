// middlewares/reqLog.js
const morgan = require("morgan");
const fs = require("fs");

const logStream = {
  write: (message) => {
    fs.appendFile(
      "./logs.txt",
      message,
      (err) => {
        if (err) console.error("Failed to save log:", err);
      }
    );
  },
};

const reqLog = morgan("combined", { stream: logStream });

module.exports = reqLog;
