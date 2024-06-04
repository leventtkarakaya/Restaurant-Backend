const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send({
        message: "Authorization header is missing",
        success: false,
      });
    }
    const token = req.headers["authorization"].split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded) {
      req.body.userId = decoded.id;
      next();
    } else {
      res.status(401).send({
        message: "Token is invalid or has expired",
        success: false,
      });
    }
  } catch (error) {
    console.log("🚀 ~ protect ~ error:", error);
    res.status(500).send({
      message: "Auth error",
      success: false,
    });
  }
};

module.exports = protect;
