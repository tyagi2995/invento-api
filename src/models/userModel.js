const { getPool } = require("../config/db");

class User {
  static async getAllUsers(officeId) {
    const pool = getPool(); // ✅ get the actual pool
    let sql = "SELECT * FROM users";
    const params = [];

    if (officeId) {
      sql += " WHERE office_id = ?";
      params.push(officeId);
    }

    const [rows] = await pool.query(sql, params);
    return rows;
  }
}

module.exports = User;
