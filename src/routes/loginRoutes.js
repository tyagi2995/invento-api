const express = require("express");
const loginController = require("../controllers/loginController");
const validate = require("../middleware/validateMiddleware");
const { loginSchema } = require("../validations/loginValidation");

const router = express.Router();

router.post("/", validate(loginSchema), loginController.loginUser);

module.exports = router;
