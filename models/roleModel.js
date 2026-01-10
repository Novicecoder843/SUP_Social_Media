const pool = require("../config/db");

const RoleModel = {
  createRole: async (name) => {
    const query = `
      INSERT INTO user_schema.roles (name , description)
      VALUES ($1,$2)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [name , description]);
    return rows[0];
  },

  getAllRoles: async () => {
    const query = `SELECT * FROM user_schema.roles ORDER BY id ASC`;
    const { rows } = await pool.query(query);
    return rows;
  },

  getRoleById: async (id) => {
    const query = `SELECT * FROM user_schema.roles WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  updateRole: async (id, name , description) => {
    const query = `
      UPDATE user_schema.roles
      SET name = $1 , description = $2 , updated_at=NOW()
      WHERE id = $3
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [name,description, id]);
    return rows[0];
  },

  deleteRole: async (id) => {
    const query = `DELETE FROM user_schema.roles WHERE id = $1`;
    await pool.query(query, [id]);
    return true;
  },
};

module.exports = RoleModel;
