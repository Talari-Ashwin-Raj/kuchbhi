const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth.middleware');
const driverOnly = require('../middlewares/driverOnly');
const controller = require('../controllers/driver.controller');
router.get('/dashboard',auth, driverOnly, controller.getDashboard);
router.get('/requests',auth, driverOnly, controller.getRequests);
router.post('/accept-request/:id',auth, driverOnly, controller.acceptRequest);

module.exports = router