const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const userControllers = require('../controllers/user.controller')

router.get('/dashboard', authMiddleware, userControllers.getDashboard)
router.get('/cars', authMiddleware, userControllers.getCars)
router.post('/cars', authMiddleware, userControllers.postCars)
router.get('/parking-area-by-qr/:qrCode', authMiddleware, userControllers.getParkingAreaByQr);

router.post('/create-ticket', authMiddleware, userControllers.createTicket);
router.post('/request-retrieval/:ticketNo', authMiddleware, userControllers.requestRetrieval);

module.exports = router;