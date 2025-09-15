const express = require("express");
const { errors } = require("celebrate");

const userRoutes = require("./userRoutes");

const router = express.Router();

// Mount user routes at /users
router.use("/users", userRoutes);

// Celebrate error handler (for Joi validation errors)
router.use(errors());

module.exports = router;
