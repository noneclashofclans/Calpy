const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User.js')

router.post('/register', async(req, res) => {
    try{
        const {username, email, phone, password} = req.body;

        if (!username || !email || !phone || !password) {
            return res.status(400).json({message: "Pls fill all details"})
        }

        const user = await User.findOne({$or: [{email}, {username}]});

        if (user) res.status(400).json({message: "User already present"})

        // else case
        const salting = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salting);

        const newUser = await User.create({
            username, 
            email,
            phone,
            password: hashedPassword,
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                phone: newUser.password
            }
        })
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({message: "Error while registering."})
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const matched = await bcrypt.compare(password, user.password);

        if (!matched) {
            return res.status(401).json({ message: 'Invalid email/password' });
        }

        const payload = {
            userEmail: user.email,
            userName: user.username
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '200d' });

        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {
        console.log("LOGIN ERROR:", error);
        res.status(500).json({ message: 'Error at login' });
    }
});

module.exports = router;