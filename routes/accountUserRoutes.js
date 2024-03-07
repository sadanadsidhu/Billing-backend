const express = require("express");
const router = express.Router();
// const cors = require("cors");
// const { test, registerUser, login } = require("../controllers/authController");
const { registerUser, login} = require('../controllers/accountUserController');

// Middleware
// router.use(cors());



router.post('/register', registerUser);
router.post('/login', login);

module.exports = router;