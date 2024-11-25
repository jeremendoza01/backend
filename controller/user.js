const User = require("./model/user")
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
  getAllUsers: async (req, res) => {
    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort === "desc" ? -1 : 1;

    try {
      const users = await User.find().select('-password').limit(limit).sort({ username: sort });
      res.status(200).json({
        status: "success",
        data: users
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message
      });
    }
  },

  getUser: async (req, res) => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: { id: "User ID is required!" }
      });
    }

    try {
      const user = await User.findById(id).select('-password');
      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "User not found!"
        });
      }
      res.status(200).json({
        status: "success",
        data: user
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message
      });
    }
  },

  addUser: async (req, res) => {
    const { email, username, password, firstname, lastname } = req.body;

    if (!email || !username || !password || !firstname || !lastname) {
      return res.status(400).json({
        status: "fail",
        message: "All fields (email, username, password, firstname, lastname) are required."
      });
    }

    try {
      const hashedPassword = hashSync(password, genSaltSync(10));
      const user = new User({
        email,
        username,
        password: hashedPassword,
        name: { first: firstname, last: lastname }
      });
      const newUser = await user.save();
      res.status(201).json({
        status: "success",
        data: newUser
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message
      });
    }
  },

  editUser: async (req, res) => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: { id: "Missing User ID!" }
      });
    }

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "User not found!"
        });
      }

      user.email = req.body.email || user.email;
      user.username = req.body.username || user.username;
      if (req.body.password) {
        user.password = hashSync(req.body.password, genSaltSync(10));
      }
      user.name.first = req.body.firstname || user.name.first;
      user.name.last = req.body.lastname || user.name.last;

      const updatedUser = await user.save();
      res.status(200).json({
        status: "success",
        data: updatedUser
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message
      });
    }
  },

  deleteUser: async (req, res) => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: { id: "Missing User ID!" }
      });
    }

    try {
      await User.findByIdAndDelete(id);
      res.status(200).json({
        status: "success",
        message: "User deleted successfully!"
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message
      });
    }
  }
};

