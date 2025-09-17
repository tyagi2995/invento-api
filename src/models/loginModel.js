const { getPool } = require("../config/db");

const User = {
  findByEmail: async (email) => {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.password, u.role_id, u.office_id,
              r.name as role_name,
              GROUP_CONCAT(p.permission_name) as permissions
       FROM users u
       LEFT JOIN roles r ON r.id = u.role_id
       LEFT JOIN role_permissions rp ON rp.role_id = r.id
       LEFT JOIN permissions p ON p.id = rp.permission_id
       WHERE u.email = ?
       GROUP BY u.id`,
      [email]
    );
    return rows[0] || null;
  },
};

module.exports = User;
