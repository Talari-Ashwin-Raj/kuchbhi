const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

exports.requestDriver = async (req, res) => {
  try {
    const managerId = req.user.id; // from JWT
    const { name, email, password, dlNumber } = req.body;

    const manager = await prisma.manager.findUnique({
      where: { userId: managerId },
      include: { area: true }
    });

    if (!manager || !manager.area) {
      return res.status(400).json({ error: 'Manager not assigned to area' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: 'DRIVER'
      }
    });

    await prisma.driver.create({
      data: {
        userId: user.id,
        parkingAreaId: manager.area.id,
        dlNumber,
        status: 'INACTIVE'
      }
    });

    res.status(201).json({ message: 'Driver request sent for approval' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to request driver' });
  }
};

exports.getDashboard = async (req, res) => {
    try {
      const managerId = req.user.id;
  
      const manager = await prisma.manager.findUnique({
        where: { userId: managerId },
        include: {
          area: {
            include: {
              drivers: {
                include: { user: true }
              }
            }
          }
        }
      });
  
      res.json(manager);
  
    } catch (err) {
      res.status(500).json({ error: 'Failed to load dashboard' });
    }
  };

