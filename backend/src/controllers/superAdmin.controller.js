const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

exports.getParkingAreas = async (req, res) => {
  try {
    const areas = await prisma.parkingArea.findMany({
      include: {
        manager: {
          include: { user: true }
        }
      }
    });

    res.json(areas);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch parking areas' });
  }
};

exports.createParkingArea = async (req, res) => {
    try {
      const { name, location, qrCode, amount, managerId } = req.body;
  
      const area = await prisma.parkingArea.create({
        data: {
          name,
          location,
          qrCode,
          amount: String(amount),
          managerId
        }
      });
  
      await prisma.manager.update({
        where: { userId: managerId },
        data: { status: 'ACTIVE' }
      });
  
      res.status(201).json(area);
  
    } catch (err) {
      console.error("CREATE PARKING AREA ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  };

exports.createManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: 'MANAGER'
      }
    });

    await prisma.manager.create({
      data: {
        userId: user.id,
        status: 'PENDING'
      }
    });

    res.status(201).json({ message: 'Manager created' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getManagers = async (req, res) => {
  try {
    const managers = await prisma.manager.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json(managers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.approveDriver = async (req, res) => {
    try {
        console.log('hello')
      const { userId } = req.params;
  
      await prisma.driver.update({
        where: { userId },
        data: { status: 'AVAILABLE' }
      });
      console.log('hello1')
      res.json({ message: 'Driver approved' });
  
    } catch (err) {
      res.status(500).json({ error: 'Failed to approve driver' });
    }
  };
  
exports.getPendingDrivers = async (req, res) => {
    try {
      const drivers = await prisma.driver.findMany({
        where: { status: 'INACTIVE' },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          parkingArea: {
            select: { id: true, name: true }
          }
        }
      });
      res.json(drivers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch pending drivers' });
    }
  };

