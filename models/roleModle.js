const db = require("../config/db");

exports.createRole = async (role_name, description) => {
  const query = `
    INSERT INTO roles (role_name, description)
    VALUES ($1, $2)
    RETURNING *
  `;
  return db.query(query, [role_name, description]);
};

exports.getAllRoles = async () => {
  return db.query(`SELECT * FROM roles WHERE status = true`);
};

exports.getRoleById = async (id) => {
  return db.query(`SELECT * FROM roles WHERE id = $1`, [id]);
};

exports.updateRole = async (id, role_name, description) => {
  const query = `
    UPDATE roles
    SET role_name = $1,
        description = $2,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
  `;
  return db.query(query, [role_name, description, id]);
};

exports.deactivateRole = async (id) => {
  return db.query(
    `UPDATE roles SET status = false WHERE id = $1`,
    [id]
  );
};