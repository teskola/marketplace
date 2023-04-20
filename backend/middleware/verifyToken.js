const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    
    return res.status(401).send("Authentication failed");
  }

  try {
  const decodedToken = jwt.verify(token, process.env.JWT_KEY);
  if (!decodedToken && !decodedToken.id) {
    return res.status(401).send("Authentication failed");
  }
  req.userData = { userId: decodedToken.id };
  next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }  
};

module.exports = verifyToken;
