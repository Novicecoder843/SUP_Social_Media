const RoleModel = require("../models/roleModel");

exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = await RoleModel.createRole(name, description);
    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await RoleModel.getAllRoles();
    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedRole = await RoleModel.updateRole(id, name, description);

    if (!updatedRole) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: updatedRole,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRole = await RoleModel.deleteRole(id);

    if (!deletedRole) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};