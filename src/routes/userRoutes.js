const express = require("express");
const { celebrate } = require("celebrate");
const userController = require("../controllers/userController");
const userValidation = require("../validations/userValidation");

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", celebrate(userValidation.create), userController.createUser);
router.put("/:id", celebrate(userValidation.update), userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
