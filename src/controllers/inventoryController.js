// src/controllers/inventoryController.js
const { Inventory, User, Office } = require("../models/index");

exports.createInventory = async (req, res) => {
  try {
    const { name, qty, itemType, officeId, ...otherFields } = req.body;

    const inventory = await Inventory.create({
      name,
      qty,
      itemType,
      officeId,
      ...otherFields,
    });

    res.status(201).json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInventories = async (req, res) => {
  try {
    const { officeId } = req.user;
    const whereClause = req.user.roleName === "super_admin" ? {} : { officeId };

    const inventories = await Inventory.findAll({
      where: whereClause,
      include: [
        { model: Office, attributes: ["name"] },
        { model: User, as: "issuedToUser", attributes: ["name"] },
        { model: User, as: "issuedByUser", attributes: ["name"] },
      ],
    });

    res.status(200).json(inventories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.issueInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { issuedTo, issuedBy } = req.body;

    const inventory = await Inventory.findByPk(id);
    if (!inventory)
      return res.status(404).json({ message: "Inventory not found" });

    await inventory.update({
      issuedTo,
      issuedBy,
      issuedDate: new Date(),
      status: "issued",
    });

    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.returnInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const inventory = await Inventory.findByPk(id);
    if (!inventory)
      return res.status(404).json({ message: "Inventory not found" });

    await inventory.update({
      issuedTo: null,
      issuedBy: null,
      issuedDate: null,
      returnDate: new Date(),
      status: "available",
    });

    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
