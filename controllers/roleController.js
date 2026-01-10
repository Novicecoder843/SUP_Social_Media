const RoleModel = require("../models/roleModel");

exports.createRole = async (req, res) => {
  try {
    const { name,description } = req.body;
    const role = await RoleModel.createRole(name,description);
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await RoleModel.getAllRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await RoleModel.getRoleById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { name , description } = req.body;
    const role = await RoleModel.updateRole(req.params.id, name,description);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    await RoleModel.deleteRole(req.params.id);
    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
