const db = require("../config/db");

const RoleModel = {
  createRole: async (name, description) => {
    const query = `
      INSERT INTO roles (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [name, description];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  getAllRoles: async () => {
    const query = `SELECT * FROM roles ORDER BY id DESC`;
    const result = await db.query(query);
    return result.rows;
  },

  updateRole: async (id, name, description) => {
    const query = `
      UPDATE roles
      SET name = $1, description = $2
      WHERE id = $3
      RETURNING *
    `;
    const values = [name, description, id];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  deleteRole: async (id) => {
    const query = `DELETE FROM roles WHERE id = $1 RETURNING *`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = RoleModel;