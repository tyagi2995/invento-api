// src/routes/route.js
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running perfectly",
  });
});

router.use("/auth", require("./authRoutes"));

module.exports = router;
