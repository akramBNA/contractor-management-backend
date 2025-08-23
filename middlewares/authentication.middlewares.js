import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.AUTH_SECRET_KEY || "";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Access denied. No token provided.",
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        status: false,
        message: "Invalid or expired token.",
      });
    }

    req.user = decoded;
    next();
  });
};
