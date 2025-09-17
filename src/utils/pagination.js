const { Op } = require("sequelize");

exports.getPaginationAndSearch = (req, searchMap = {}) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const offset = (page - 1) * limit;

  const whereCondition = {};

  for (const [queryParam, dbFields] of Object.entries(searchMap)) {
    const value = (req.query[queryParam] || "").trim();
    if (!value) continue;

    whereCondition[Op.and] = whereCondition[Op.and] || [];

    if (Array.isArray(dbFields)) {
      whereCondition[Op.and].push({
        [Op.or]: dbFields.map((field) => ({
          [field]: { [Op.like]: `%${value}%` },
        })),
      });
    } else {
      whereCondition[Op.and].push({
        [dbFields]: { [Op.like]: `%${value}%` },
      });
    }
  }

  return {
    pagination: { limit, offset },
    whereCondition,
    meta: { page, limit },
  };
};
