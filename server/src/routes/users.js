const express = require('express');
const userController = require('../controllers/userController');
const { auth, optionalAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/profile/:id', optionalAuth, userController.getProfile);

router.post('/follow/:id', auth, userController.toggleFollow);

router.get('/organizers', userController.listOrganizers);

module.exports = router;
