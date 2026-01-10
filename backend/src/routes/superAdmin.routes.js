const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth.middleware');
const superAdminOnly = require('../middlewares/superAdminOnly');
const controller = require('../controllers/superAdmin.controller');

router.post('/managers',controller.createManager);
router.get('/managers', auth, superAdminOnly, controller.getManagers);
router.get('/parking-areas', auth, superAdminOnly, controller.getParkingAreas);
router.post('/parking-areas', controller.createParkingArea);

module.exports = router
