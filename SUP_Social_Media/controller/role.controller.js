const Role = require('../models/role.model');

exports.createRole = async (req, res) => {
  try {
    const { role_name } = req.body;
    const result = await Role.create(role_name);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRoles = async (req, res) => {
  const result = await Role.findAll();
  res.json(result.rows);
};

exports.getRole = async (req, res) => {
  const result = await Role.findById(req.params.id);
  if (!result.rows.length)
    return res.status(404).json({ message: 'Role not found' });

  res.json(result.rows[0]);
};

exports.updateRole = async (req, res) => {
  const result = await Role.update(req.params.id, req.body.role_name);
  res.json(result.rows[0]);
};

exports.deleteRole = async (req, res) => {
  const result = await Role.softDelete(req.params.id);
  res.json({
    message: 'Role deactivated',
    role: result.rows[0]
  });
};
