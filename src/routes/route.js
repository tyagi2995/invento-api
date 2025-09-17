// src/routes/route.js
const express = require("express");
const { errors } = require("celebrate");

// Import module routes
const userRoutes = require("./userRoutes");
const loginRoutes = require("./loginRoutes");
// You can add future modules here:
// const inventoryRoutes = require("./inventoryRoutes");
// const officeRoutes = require("./officeRoutes");

const router = express.Router();

/**
 * -----------------------------------
 * Default Test Route
 * -----------------------------------
 */
router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
    docs: `${req.protocol}://${req.get("host")}/api/docs`,
  });
});

/**
 * -----------------------------------
 * Mount Module Routes
 * -----------------------------------
 */
router.use("/login", loginRoutes);
router.use("/users", userRoutes);
// router.use("/inventory", inventoryRoutes);
// router.use("/offices", officeRoutes);

/**
 * -----------------------------------
 * Celebrate Error Handler
 * -----------------------------------
 * Handles all Joi validation errors centrally
 */
router.use(errors());

/**
 * -----------------------------------
 * Export Router
 * -----------------------------------
 */
module.exports = router;
