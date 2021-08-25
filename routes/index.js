const express = require('express');
const usersRoutes = require('./users');
const chatsRoutes = require('./chats');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.use('/api',[
  usersRoutes,
  chatsRoutes
]);

module.exports = router;


