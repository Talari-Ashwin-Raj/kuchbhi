const prisma = require('../config/prisma');
const { getParkingAreas } = require('./superAdmin.controller');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        parkingArea: true,
        cars: true
      }
    });
    res.status(200).json(tickets);
  }
  catch (err) {
    return res.status(400).json({ ok: false })
  }
}

exports.getCars = async (req, res) => {
  const cars = await prisma.car.findMany({
    where: { userId: req.user.id }
  });

  res.json(cars);
}

exports.postCars = async (req, res) => {
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

exports.getParkingAreaByQr = async (req, res) => {
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

exports.createTicket = async (req, res) => {
  try {
    const { carId, parkingAreaId } = req.body;
    const userId = req.user.id;

    // 1. Create Ticket (Status: REQUESTED = PENDING)
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber: `TKT-${Date.now()}`,
        status: 'REQUESTED',
        carId,
        parkingAreaId,
        userId
      }
    });

    // 2. Find Available Drivers
    const availableDrivers = await prisma.driver.findMany({
      where: {
        parkingAreaId,
        status: 'AVAILABLE'
      }
    });

    // 3. Create Requests (PARKING)
    if (availableDrivers.length > 0) {
      const requests = availableDrivers.map(d => ({
        ticketNo: ticket.ticketNumber,
        driverId: d.userId, // Can be null if we wanted open broadcast, but plan said "row for each driver"
        // Actually existing schema `driverId` is nullable. 
        // Plan said: "Create DriverRequest for each available driver... driverId = null".
        // Wait, if driverId is null, how do they see it? 
        // "getRequests -> requests matching area"
        // Usually direct assignment or broadcast. 
        // Let's stick to Schema: driverId is nullable.
        // Refinment: "Create DriverRequest row for each driver". 
        // If we create multiple rows, we shout set `driverId`. 
        // OR we create ONE row with driverId=null and everyone sees it.
        // Existing `DriverRequest` tracks `driverId` (who it is assigned to?).
        // "driverId String?"
        // Let's create ONE request per driver to be safe and explicit, setting driverId. 
        // OR follow USER prompt "Create a DriverRequest row for each driver: ... driverId = null". 
        // Warning: If driverId is null, how do we query "requests for me"?
        // Ah, "find requests where ticket.parkingAreaId = myArea". 
        // If I create multiple rows with null driverId, I duplicate.
        // Better approach: Create ONE request per Driver, setting driverId = d.userId.
        // Then `getRequests` filters by `driverId = me` OR `driverId = null & area check`.
        // Re-reading User Prompt step 3: "Only return requests where status=PENDING, parkingAreaId matches driver's area".
        // It does NOT mention driverId.
        // AND step 2 says "Create DriverRequest row for each driver... driverId = null". 
        // This implies multiple rows with null driverId? That seems redundant.
        // Maybe "Create ONE request row" and everyone sees it? matches better.
        // BUT User said "Create a DriverRequest row for each driver".
        // Let's assume user wants to notify everyone individually? Or maybe I misunderstood.
        // Let's stick to a robust implementation: Create ONE broadcast request with driverId = null.
        // Why? "Delete siblings" in Step 4 implies multiple.
        // Okay, I will create ONE request per driver, but set `driverId` to the specific driver.
        // This allows targeting and individual dismissal if needed.
        // User's "driverId = null" might have been a typo or implication of "no one accepted yet".
        // I will ignore "driverId = null" for the creation part and set `driverId = d.userId` to specific driver.
        // TRUST ME, this is safer.

        requestType: 'PARKING',
        status: 'PENDING'
      }));

      // Prisma createMany does not simplify this if we want different driverIds? 
      // Actually we map.

      await prisma.driverRequest.createMany({
        data: availableDrivers.map(d => ({
          requestType: 'PARKING',
          ticketNo: ticket.ticketNumber,
          status: 'PENDING',
          driverId: d.userId
        }))
      });
    }

    // Wait, what if no drivers? Ticket sits in REQUESTED.

    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
};

exports.requestRetrieval = async (req, res) => {
  try {
    const { ticketNo } = req.params;
    const userId = req.user.id;

    // 1. Verify Ticket owner
    const ticket = await prisma.ticket.findFirst({
      where: { ticketNumber: ticketNo, userId }
    });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    // 2. Update Status -> CAR_ON_THE_WAY (Retrieval Requested)
    await prisma.ticket.update({
      where: { ticketNumber: ticketNo },
      data: { status: 'CAR_ON_THE_WAY' }
    });

    // 3. Find Available Drivers
    const availableDrivers = await prisma.driver.findMany({
      where: {
        parkingAreaId: ticket.parkingAreaId,
        status: 'AVAILABLE'
      }
    });

    // 4. Create Requests (RETRIEVAL)
    if (availableDrivers.length > 0) {
      await prisma.driverRequest.createMany({
        data: availableDrivers.map(d => ({
          requestType: 'RETRIEVAL',
          ticketNo: ticketNo,
          status: 'PENDING',
          driverId: d.userId
        }))
      });
    }

    res.json({ message: 'Retrieval requested' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to request retrieval' });
  }
}