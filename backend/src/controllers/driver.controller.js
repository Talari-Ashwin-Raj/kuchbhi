
const prisma = require('../config/prisma');

exports.getDashboard = async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { userId: req.user.id },
      include: { user: true }
    });

    // ACTIVE JOB LOGIC
    // We look for an APPROVED request for this driver where the ticket is not yet COMPLETED.
    let activeRequest = null;
    if (driver.status === 'BUSY') {
      activeRequest = await prisma.driverRequest.findFirst({
        where: {
          driverId: req.user.id,
          status: 'APPROVED',
          ticket: {
            status: {
              not: 'COMPLETED'
            }
          }
        },
        include: { ticket: true },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json({ ...driver, activeRequest: activeRequest || null });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({ where: { userId: req.user.id } });

    const requests = await prisma.driverRequest.findMany({
      where: {
        status: 'PENDING',
        ticket: { parkingAreaId: driver.parkingAreaId },
        driverId: req.user.id
      },
      include: { ticket: true }
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const driverId = req.user.id;

    await prisma.$transaction(async (tx) => {
      const req = await tx.driverRequest.findUnique({ where: { id } });
      if (!req || req.status !== 'PENDING') throw new Error('Invalid request');

      // Lock Request
      await tx.driverRequest.update({
        where: { id },
        data: { status: 'APPROVED', driverId }
      });

      // Cleanup siblings
      await tx.driverRequest.deleteMany({
        where: { ticketNo: req.ticketNo, status: 'PENDING', id: { not: id } }
      });

      // Update Ticket -> DRIVER_ASSIGNED
      await tx.ticket.update({
        where: { ticketNumber: req.ticketNo },
        data: { status: 'DRIVER_ASSIGNED' }
      });

      // Update Driver -> BUSY
      await tx.driver.update({
        where: { userId: driverId },
        data: { status: 'BUSY' }
      });
    });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.parkCar = async (req, res) => {
  try {
    const { ticketNo } = req.params;
    await prisma.$transaction(async (tx) => {
      await tx.ticket.update({
        where: { ticketNumber: ticketNo },
        data: { status: 'PARKED' }
      });
      await tx.driver.update({
        where: { userId: req.user.id },
        data: { status: 'AVAILABLE' }
      });
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to park' });
  }
};

exports.completeJob = async (req, res) => {
  try {
    const { ticketNo } = req.params;
    await prisma.$transaction(async (tx) => {
      await tx.ticket.update({
        where: { ticketNumber: ticketNo },
        data: { status: 'COMPLETED' }
      });
      await tx.driver.update({
        where: { userId: req.user.id },
        data: { status: 'AVAILABLE' }
      });
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete job' });
  }
};