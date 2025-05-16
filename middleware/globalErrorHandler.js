import { appendFile } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Deriving __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a writable stream for the log file
const logFile = join(__dirname, "logs.txt");

const errorLogger = (err, req, res, next) => {
  const log = `
[${new Date().toISOString()}]
Error: ${err.message}
URL: ${req.originalUrl}
Method: ${req.method}
Stack Trace:
${err.stack}

-------------------------
`;

  // Append the error to logs.txt
  appendFile(logFile, log, (fileErr) => {
    if (fileErr) {
      console.error("Failed to write to log file:", fileErr);
    }
  });

  next();
  // You can customize the response here
  res.status(500).json({ message: "Internal Server Error" });
};

export default errorLogger;
