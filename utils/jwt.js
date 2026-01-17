import jwt from "jsonwebtoken";

// Sign a JWT token with a 2-hour expiration
export const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

// Verify a JWT token and return the decoded payload
export const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);
