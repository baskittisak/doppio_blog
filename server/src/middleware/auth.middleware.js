import jwt from "jsonwebtoken";

export const blacklist = new Set();

export const authCheckToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const { SECRET_KEY } = process.env;
      if (!SECRET_KEY) {
        res
          .status(500)
          .json({ message: "Internal server error: Missing SECRET_KEY" });
        return;
      }

      if (blacklist.has(token)) {
        res
          .status(401)
          .json({ message: "Token invalid, authorization denied" });
      }

      jwt.verify(token, SECRET_KEY);
      next();
    } else {
      res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }
  } catch (error) {
    res.status(403).json({ message: "Token is expired" });
  }
};
