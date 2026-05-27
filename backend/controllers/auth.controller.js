const authService = require('../services/auth.service');

async function login(req, res) {
  try {
    res.json(await authService.login(req.body));
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({
      message: status === 500
        ? 'Login failed because of a server or database error. Check backend logs for details.'
        : error.message
    });
  }
}

async function register(req, res) {
  res.status(201).json(await authService.createUser(req.body));
}

module.exports = { login, register };
