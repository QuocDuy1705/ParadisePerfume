import validator from "validator";
import xss from "xss";

// Sanitize chat message
export const sanitizeMessage = (message) => {
  if (!message || typeof message !== "string") {
    throw new Error("Invalid message");
  }

  // Trim whitespace
  let sanitized = message.trim();

  // Check if empty after trim
  if (sanitized.length === 0) {
    throw new Error("Message cannot be empty");
  }

  // Check length (max 2000 characters)
  if (sanitized.length > 2000) {
    throw new Error("Message too long (max 2000 characters)");
  }

  // Remove XSS attacks (escape HTML tags)
  sanitized = xss(sanitized, {
    whiteList: {}, // No HTML tags allowed
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script", "style"],
  });

  // Escape special characters for safety
  sanitized = validator.escape(sanitized);

  return sanitized;
};

// Sanitize user input (general purpose)
export const sanitizeInput = (input, maxLength = 500) => {
  if (!input || typeof input !== "string") {
    return "";
  }

  let sanitized = input.trim();

  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  sanitized = xss(sanitized, {
    whiteList: {},
    stripIgnoreTag: true,
  });

  sanitized = validator.escape(sanitized);

  return sanitized;
};

// Validate email
export const isValidEmail = (email) => {
  return validator.isEmail(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  // Vietnamese phone: 10 digits, starts with 0
  return /^0\d{9}$/.test(phone);
};
