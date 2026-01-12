const RoleModel = require("../model/role.model");

exports.createRole = async (req, res) => {
  const { role_name, description } = req.body;
  const role = await RoleModel.createRole(role_name, description);
  res.status(201).json({ success: true, data: role });
};

exports.getRoles = async (req, res) => {
  const roles = await RoleModel.getRoles();
  res.json({ success: true, data: roles });
};
