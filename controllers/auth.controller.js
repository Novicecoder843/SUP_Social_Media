const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register({ email, password });
    res.json(user);
    return
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login({ email, password });
    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};