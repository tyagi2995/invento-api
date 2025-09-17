const express = require("express");
const userController = require("../controllers/userController");
const userValidation = require("../validations/userValidation");
const auth = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/requirePermission");

const router = express.Router();

/**
 * -------------------------------------------------
 * Utility: Validation Wrapper
 * -------------------------------------------------
 * Wraps celebrate validators for consistency.
 */
const validate = (schema) => schema;

/**
 * =================================================
 * @module User Routes
 * @basePath /api/users
 * =================================================
 * All routes are protected with:
 *  - `auth` middleware for JWT authentication
 *  - `requirePermission` middleware for RBAC control
 */

/**
 * @route   POST /api/users
 * @desc    Create a new user (Admin/Super Admin only)
 * @access  Protected
 */
router.post(
  "/",
  auth,
  requirePermission("create_user"),
  validate(userValidation.createUserValidator),
  userController.createUser
);

/**
 * @route   GET /api/users
 * @desc    Get all users (optionally filter by office_id)
 * @access  Protected
 */
router.get(
  "/",
  auth,
  requirePermission("view_user"),
  userController.getAllUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by ID
 * @access  Protected
 */
router.get(
  "/:id",
  auth,
  requirePermission("view_user"),
  validate(userValidation.getUserValidator),
  userController.getUserById
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user's details
 * @access  Protected
 */
router.put(
  "/:id",
  auth,
  requirePermission("edit_user"),
  validate(userValidation.updateUserValidator),
  userController.updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user by ID
 * @access  Protected
 */
router.delete(
  "/:id",
  auth,
  requirePermission("delete_user"),
  validate(userValidation.deleteUserValidator),
  userController.deleteUser
);

module.exports = router;
