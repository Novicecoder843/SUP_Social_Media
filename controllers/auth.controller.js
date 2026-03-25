const authService = require("../services/auth.service");
const pool = require("../config/db");
exports.register = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await authService.register({
      email,
      password,
    });

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const data = await authService.login({
      email,
      password,
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.refresh = async (req, res) => {
  try {

    const { refreshToken } = req.body;

    const data =
      await authService.refresh(refreshToken);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.logout = async (req, res) => {
  try {

    const { refreshToken } = req.body;

    const data =
      await authService.logout(refreshToken);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const data =
      await authService.forgotPassword(email);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.resetPassword = async (req, res) => {
  try {

    const { token, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE reset_token=$1",
      [token]
    );

    if (user.rows.length === 0) {
      return res.json({ error: "Invalid token" });
    }

    await pool.query(
      "UPDATE users SET password=$1, reset_token=NULL WHERE reset_token=$2",
      [password, token]
    );

    res.status(200).json({ message: "Password reset success" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};