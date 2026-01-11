const db = require('../config/db');

class RoleModel {

  static create(role_name) {
    return db.query(
      `INSERT INTO auth.roles (role_name)
       VALUES ($1) RETURNING *`,
      [role_name]
    );
  }

  static findAll() {
    return db.query(
      `SELECT * FROM auth.roles WHERE status='active'`
    );
  }

  static findById(id) {
    return db.query(
      `SELECT * FROM auth.roles WHERE id=$1`,
      [id]
    );
  }

  static update(id, role_name) {
    return db.query(
      `UPDATE auth.roles
       SET role_name=$1, updated_at=NOW()
       WHERE id=$2 RETURNING *`,
      [role_name, id]
    );
  }

  static softDelete(id) {
    return db.query(
      `UPDATE auth.roles
       SET status='inactive', updated_at=NOW()
       WHERE id=$1 RETURNING *`,
      [id]
    );
  }
}

module.exports = RoleModel;
