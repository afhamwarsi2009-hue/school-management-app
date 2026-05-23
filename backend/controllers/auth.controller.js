const authService = require('../services/auth.service');

async function login(req, res) {
  res.json(await authService.login(req.body));
}

async function register(req, res) {
  res.status(201).json(await authService.createUser(req.body));
}

module.exports = { login, register };
