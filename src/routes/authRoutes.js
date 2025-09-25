const express = require("express");
const authController = require("../controllers/authController");
const validate = require("../middleware/validateMiddleware");
const {
  loginSchema,
  registerSchema,
} = require("../validations/authValidation");

const router = express.Router();

// Login endpoint
router.post("/login", validate(loginSchema), authController.loginUser);

// Registration endpoint
router.post("/register", validate(registerSchema), authController.createUser);

// Verify user endpoint
// router.post("/verify-user", authController.verifyUser);
router.post("/", authController.verifyUser);

router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Auth API is running",
  });
});

module.exports = router;
