const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

exports.getDashboard = async (req, res) => {
    try {
      const driver = await prisma.driver.findUnique({
        where: { userId: req.user.id },
        include: { user: true }
      });
  
      res.json(driver);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  };

exports.getRequests = async (req, res) => {
try {
    const driver = await prisma.driver.findUnique({
    where: { userId: req.user.id }
    });

    const requests = await prisma.driverRequest.findMany({
    where: {
        status: 'PENDING',
        ticket: { parkingAreaId: driver.parkingAreaId }
    }
    });

    res.json(requests);
} catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests' });
}
};
exports.acceptRequest = async (req, res) => {
    try {
      const { id } = req.params;
  
      const updated = await prisma.driverRequest.update({
        where: { id },
        data: {
          status: 'APPROVED',
          driverId: req.user.id
        }
      });
  
      await prisma.driver.update({
        where: { userId: req.user.id },
        data: { status: 'BUSY' }
      });
  
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to accept request' });
    }
  };