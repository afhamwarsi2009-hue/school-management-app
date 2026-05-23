const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { asyncHandler } = require('../middleware/asyncHandler');
const { validate } = require('../middleware/validate');
const { loginSchema } = require('../validation/auth.validation');

router.post('/login', validate(loginSchema), asyncHandler(authController.login));

module.exports = router;
