import rateLimit from "express-rate-limit";

// Rate limiter for chat messages - 100 messages per hour per user
export const chatMessageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each user to 100 requests per windowMs
  message: {
    message:
      "Too many messages sent from this account, please try again after an hour",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for admins
  skip: (req) => req.user?.isAdmin === true,
});

// Rate limiter for conversation creation - 100 per hour (increased for development)
export const conversationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Increased from 10 to 100 for development
  message: {
    message: "Too many conversation requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter - 1000 requests per 15 minutes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: {
    message: "Too many requests from this IP, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
