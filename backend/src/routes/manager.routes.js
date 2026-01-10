const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth.middleware');
const ManagerOnly = require('../middlewares/ManagerOnly');
const controller = require('../controllers/manager.controller');

router.get('/dashboard', auth, ManagerOnly, controller.getDashboard);
router.post('/request-driver', auth, ManagerOnly, controller.requestDriver);

module.exports = router