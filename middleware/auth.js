const jwt = require("jsonwebtoken"); // Import JWT for generating tokens
const User = require("../model/user");

exports.authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  console.log("token",token);
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  const user = jwt.verify(token, "secretkey");
  User.findByPk(user.userId)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
};
