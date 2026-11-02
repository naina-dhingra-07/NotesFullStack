const router = require('express').Router();
const protect = require('../middleware/auth');
const { register, login, logout, me } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, me);

module.exports = router;
