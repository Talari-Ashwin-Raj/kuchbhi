const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth.middleware');
const driverOnly = require('../middlewares/driverOnly');
const controller = require('../controllers/driver.controller');
router.get('/dashboard', auth, driverOnly, controller.getDashboard);
router.get('/requests', auth, driverOnly, controller.getRequests);
router.post('/accept-request/:id', auth, driverOnly, controller.acceptRequest);

router.post('/park/:ticketNo', auth, driverOnly, controller.parkCar);
router.post('/complete/:ticketNo', auth, driverOnly, controller.completeJob);

module.exports = router