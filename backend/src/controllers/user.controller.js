const prisma = require('../config/prisma')

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

module.exports = {getDashboard,getCars,postCars}