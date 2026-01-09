const express = require('express')
const cors = require('cors')
const prisma = require('./config/prisma')
require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', async(req, res) => {
    const users = await prisma.user.findMany()
    res.json({users})
})

const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
app.use('/api/auth', authRoutes)
app.use('/api/user',userRoutes)
// const userRoutes = require('./routes/user.routes')
// const ticketRoutes = require('./routes/ticket.routes')
// app.use('/api/user', userRoutes)
// app.use('/api/tickets', ticketRoutes) 

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