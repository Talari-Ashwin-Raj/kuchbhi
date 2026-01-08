const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // if (!['user'].includes(role)) {
        //     return res.status(400).json({ error: 'Only User can self-register.' });
        // }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role:"USER",
            },
        });

        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during registration.' });
    }
}

login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ ok:false,error: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ ok:false,error: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ ok:true , token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok:false ,error: 'Server error during login.' });
    }
};

module.exports = {register,login}