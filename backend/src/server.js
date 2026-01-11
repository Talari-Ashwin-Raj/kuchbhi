const express = require('express')
const cors = require('cors')
const prisma = require('./config/prisma')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    const users = await prisma.user.findMany()
    res.json({ users })
})

const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const adminRoutes = require('./routes/superAdmin.routes')
const managerRoutes = require('./routes/manager.routes')
const driverRoutes = require('./routes/driver.routes')
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/superAdmin', adminRoutes)
app.use('/api/manager', managerRoutes)
app.use('/api/driver', driverRoutes)
// app.use('/api/user', userRoutes)
// app.use('/api/tickets', ticketRoutes) 

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

async function main() {
    try {
        await prisma.$connect();
        console.log('Connected to Database');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

main();