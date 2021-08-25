const express = require('express');
const router = express.Router();

const usersCtrl = require('../controllers/users');
const middleware = require('../middlewares/auth');

router.post('/users/register',middleware.register,usersCtrl.handleRegister);
router.post('/users/login',usersCtrl.handleLogin);

module.exports = router;