import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  // Check if token is provided
  if (!token) {
    return res.status(401).json({
      errors: {
        body: ["Authorization token required"],
        code: ["TOKEN_MISSING"],
      },
    });
  }

  // Verify token
  const tokenValue = token.split(' ')[1]; 
  jwt.verify(tokenValue, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        errors: {
          body: ["Invalid token"],
          code: ["TOKEN_INVALID"],
        },
      });
    }

    req.user = decoded;
    next();
  });
};

export default authMiddleware;
