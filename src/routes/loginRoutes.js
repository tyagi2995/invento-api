const express = require("express");
const loginController = require("../controllers/loginController");
const { loginValidator } = require("../validations/loginValidation");

const router = express.Router();

/**
 * @route   POST /api/login
 * @desc    Authenticate user and return JWT token
 * @access  Public
 */
router.post("/", loginValidator, loginController.loginUser);

module.exports = router;
