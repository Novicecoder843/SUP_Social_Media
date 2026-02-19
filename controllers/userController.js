const userModel = require("../models/userModel");


exports.createUser = async (req, res) => {
  const { name, email } = req.body;
  const result = await userModel.createUser(name, email);
  res.json(result.rows[0]);
};

exports.getAllUsers = async (req, res) => {
  const result = await userModel.getAllUsers();
  res.json(result.rows);
};

exports.getUserById = async (req, res) => {
  const result = await userModel.getUserById(req.params.id);
  res.json(result.rows[0]);
};

exports.updateUser = async (req, res) => {
  const { name, email } = req.body;
  const result = await userModel.updateUser(
    req.params.id,
    name,
    email
  );
  res.json(result.rows[0]);
};

exports.hardDeleteUser = async (req, res) => {
  await userModel.hardDeleteUser(req.params.id);
  res.json({ message: "User permanently deleted" });
};


exports.softDeleteUser = async (req, res) => {
  await userModel.softDeleteUser(req.params.id);
  res.json({ message: "User soft deleted" });
};
