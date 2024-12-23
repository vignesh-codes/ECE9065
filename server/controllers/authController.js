const UserModel = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const constants = require('../constants/constants');

const home = async (req, res) => {
    try {
        res.status(200).send('Hello World from server router js ***');
    } catch (error) {
        console.error('Home Route Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

const signup = async (req, res) => {
  try {
      const { email, password, address, userType } = req.body;

      if (!email || !password) {
          return res.status(400).json({ message: "Email and password are required", success: false });
      }

      if (![0, 1].includes(userType)) {
          return res.status(400).json({ message: "Invalid userType (must be 0 or 1)", success: false });
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
          return res.status(409).json({ message: "User already exists, please log in", success: false });
      }


      const newUser = new UserModel({
          email,
          password: password,
          address: address || "",
          userType,
      });

      await newUser.save();

      res.status(201).json({
          message: "Signup successful",
          success: true,
          user: {
              email: newUser.email,
              address: newUser.address,
              userType: newUser.userType,
          },
      });
  } catch (err) {
      console.error('Signup Error:', err);
      res.status(500).json({ message: "Internal server error", success: false });
  }
};


const login = async (req, res) => {
  console.log("secret is ", constants.JWT_SECRET)

  try {
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).json({ message: "Email and password are required", success: false });
      }

      console.log("Finding user with email:", email.trim().toLowerCase());

      const user = await UserModel.findOne({ email: email.trim().toLowerCase() });
      if (!user) {
          console.error("User not found");
          return res.status(403).json({ message: "Authentication failed. Invalid email or password.", success: false });
      }

      console.log("User found:", user);

      const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Authentication failed. Invalid password." });
        }

      const token = jwt.sign(
          {
              email: user.email,
              _id: user._id,
              userType: user.userType,
          },
          constants.JWT_SECRET,
          { expiresIn: '24h' }
      );

      res.status(200).json({
          message: "Login successful",
          success: true,
          token,
          user: {
              email: user.email,
              address: user.address,
              userType: user.userType,
          },
      });
  } catch (err) {
      console.error('Login Error:', err);
      res.status(500).json({ message: "Internal server error", success: false });
  }
};



module.exports = { home, signup, login };
