// src/routes/route.js
const express = require("express");
const authenticate = require("../middleware/authenticate");
const validateRole = require("../middleware/validateRole");
const { createUser, getUsers } = require("../controllers/userController");
const {
  createInventory,
  getInventories,
  issueInventory,
  returnInventory,
} = require("../controllers/inventoryController");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
    docs: `${req.protocol}://${req.get("host")}/api/docs`,
  });
});

// User routes
router.post(
  "/users",
  authenticate,
  validateRole(["super_admin", "admin"], true),
  createUser
);
router.get(
  "/users",
  authenticate,
  validateRole(["super_admin", "admin"], true),
  getUsers
);

// Inventory routes
router.post(
  "/inventories",
  authenticate,
  validateRole(["super_admin", "admin"], true),
  createInventory
);
router.get(
  "/inventories",
  authenticate,
  validateRole(["super_admin", "admin", "user"], true),
  getInventories
);
router.put(
  "/inventories/:id/issue",
  authenticate,
  validateRole(["super_admin", "admin"], true),
  issueInventory
);
router.put(
  "/inventories/:id/return",
  authenticate,
  validateRole(["super_admin", "admin"], true),
  returnInventory
);

// router.use("/login", require("./loginRoutes"));

module.exports = router;
