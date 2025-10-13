import fs from "fs";

function log(severity, message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${severity}] ${message}\n`;

  // Append log to logs.txt file
  fs.appendFileSync("./logs.txt", logMessage, "utf8");
}

export { log };
