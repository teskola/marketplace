const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(401).send("Authentication failed");
    return;
  }

  const decodedToken = jwt.verify(token, process.env.JWT_KEY);

  if (!decodedToken && !decodedToken.id) {
    res.status(401).send("Authentication failed");
    return;
  }
  req.userData = { userId: decodedToken.id };
  next();
};

module.exports = verifyToken;
