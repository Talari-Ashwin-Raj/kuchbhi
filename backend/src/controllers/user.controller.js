const prisma = require('../config/prisma');
const { getParkingAreas } = require('./superAdmin.controller');

getDashboard = async(req,res)=>{
    try{
        const userId = req.user.id;

        const tickets = await prisma.ticket.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(tickets);
    }
    catch(err){
        return res.status(400).json({ok:false})
    }
}

getCars = async (req, res) => {
    const cars = await prisma.car.findMany({
      where: { userId: req.user.id }
    });
  
    res.json(cars);
}
postCars = async (req, res) => {
    const { plateNumber, brand, model, color } = req.body;
    if (!plateNumber || !brand || !model || !color) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const car = await prisma.car.create({
      data: {
        plateNumber,
        brand,
        model,
        color,
        userId: req.user.id // derived from token
      }
    });
    res.status(201).json(car);
  }
getParkingAreaByQr = async (req, res) => {
  try {
    const { qrCode } = req.params;

    const area = await prisma.parkingArea.findUnique({
      where: { qrCode }
    });

    if (!area) {
      return res.status(404).json({ error: 'Invalid QR Code' });
    }

    res.json(area);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to lookup parking area' });
  }
};
module.exports = {getDashboard,getCars,postCars,getParkingAreaByQr}