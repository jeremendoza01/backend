const User = require("../model/user");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");


module.exports = {
    login: async (req, res) => {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({
          status: "fail",
          message: "Username and password are required",
        });
      }
  
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return res.status(401).json({
            status: "fail",
            message: "Invalid username or password",
          });
        }
  
        const isPasswordValid = compareSync(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({
            status: "fail",
            message: "Invalid username or password",
          });
        }
  
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.status(200).json({
          status: "success",
          message: "Login successful",
          data: {
            user: {
              id: user._id,
              username: user.username,
            },
            token,
          },
        });
      } catch (err) {
        res.status(500).json({
          status: "error",
          message: "An error occurred while processing the request",
          error: err.message,
        });
      }
    },
  
    //TOKEN
    checkToken: (req, res, next) => {
      const token = req.get("auth");
  
      if (!token) {
        return res.status(401).json({
          status: "fail",
          message: "Unauthorized: Token is required",
        });
      }
  
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            status: "fail",
            message: "Invalid token",
          });
        }
  
        req.userFromJWT = { id: decoded.id };
        next();
      });
    },
  };