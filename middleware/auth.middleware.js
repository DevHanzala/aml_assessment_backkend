import { verifyToken } from "../utils/jwt.js";

// Middleware to authenticate candidate users
export const candidateAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};
