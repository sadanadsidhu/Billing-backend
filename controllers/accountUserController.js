const AcountUser = require("../models/acountuserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

////--------------------------->>>>>>>>>>>>>>>>>>>REGISTER>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const registerUser = async (req, res) => {
  try {
    const { username, phoneNumber, password, role } = req.body;
    // Check if name was entered
    if (!username) {
      return res.status(400).json({ error: "Name is required" });
    }
    // Check password
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({
          error: "Password is required and must be at least 6 characters long",
        });
    }
    // Check email
    const exists = await AcountUser.findOne({ phoneNumber });
    if (exists) {
      return res
        .status(400)
        .json({ error: "Email already exists. Please try a new email" });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await AcountUser.create({
      username,
      phoneNumber,
      password: hashedpassword,
    });
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
///////////////////////////// LOgIN ----------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
      // Check if the username exists in the database
      const user = await AcountUser.findOne({ username });

      if (!user) {
          return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid username or password' });
      }

      // If username and password are correct, generate JWT token
      const token = jwt.sign({ userId: user._id }, jwtSecretKey, { expiresIn: '1h' });

      // Return token as response
      res.json({ token });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {
  registerUser,
  login,

};