// Import the 'xss' library
// - This library removes or escapes malicious HTML/JS code (XSS attacks)
const xss = require("xss");

// Custom middleware to sanitize all user input (body, params, query)
function sanitize(req, res, next) {
  /**
   * Recursively sanitizes an object
   * - Loops through all keys in the object
   * - If the value is a string, cleans it using xss()
   * - If the value is an object (like nested JSON), it calls itself again
   */
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "string") {
        // Clean strings to remove harmful script tags or HTML
        obj[key] = xss(obj[key]);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        // Recursively sanitize nested objects
        sanitizeObject(obj[key]);
      }
    }
  };

  // Sanitize all parts of the incoming request
  if (req.body) sanitizeObject(req.body); // POST/PUT payload
  if (req.params) sanitizeObject(req.params); // URL params like /user/:id
  if (req.query) sanitizeObject(req.query); // URL query strings like ?search=

  // Continue to the next middleware or route handler
  next();
}

// Export the middleware so it can be used in index.js
module.exports = sanitize;
