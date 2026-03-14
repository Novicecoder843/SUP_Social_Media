const authService = require("../services/auth.service");

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