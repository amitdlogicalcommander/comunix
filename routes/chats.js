const express = require('express');
const router = express.Router();

const chatsCtrl = require('../controllers/chats');
const middleware = require('../middlewares/auth');

// send a message to a random user
router.post('/chats/spin', middleware.checkAuth, chatsCtrl.handleSpin);
//send a message to X random users. X will be determined by the client.
router.post('/chats/wild', middleware.checkAuth, chatsCtrl.handleWild);
// sends a message to all users
router.post('/chats/blast', middleware.checkAuth, chatsCtrl.handleBlast);

module.exports = router;
