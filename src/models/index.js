// Model Loader: Dynamically loads all models in the folder
// Why: Keeps model registration DRY and scalable as new models are added
// Benefit: No need to manually import each model, ensures all associations are set up
const fs = require("fs");
const path = require("path");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const logger = require("../utils/logger");

const db = {};

// Dynamically import all model files except index.js
fs.readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.endsWith(".js"))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes); // ✅ pass DataTypes
    db[model.name] = model;
    logger.info(`✅ Model loaded: ${model.name}`);
  });

// Set up associations for all models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Expose sequelize instance and Sequelize library
db.sequelize = sequelize;
db.Sequelize = require("sequelize");

module.exports = db;
