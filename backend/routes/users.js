const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config()

router.post('/register', async (req, res) => {
    
    try {
        const { username, email, password, isCoach } = req.body
        const user = await User.findOne({email})

        if (user) {
            res.status(404).json('Email already used')
            return
        }

        const hashPass = await bcrypt.hash(password, 10)
        const newUser = new User({username, email, password: hashPass, isCoach})

        await newUser.save()
        const token = jwt.sign({ email: newUser.email}, process.env.SECRET_KEY, { expiresIn: "1h"})

        res.status(201).json( {token, newUser})
        
    } catch (error) {
        res.status(500).json({error: 'Error registering user'})
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        
        const user = await User.findOne({email})
        if (!user) {
            res.status(400).json({ message: "User not found"})
            return
        }

        const isMatched = await bcrypt.compare(password, user.password)
        if (!isMatched) {
            res.status(400).json({ message: "incorrect password"})
            return
        }

        const token = jwt.sign({ email: user.email}, process.env.SECRET_KEY, { expiresIn: "1h"})
        res.json({ token, user})
    } catch (err) {
        res.status(500).json({error: 'Error logging in'})
    }
})

router.get('/test', (req, res) =>{
    res.send("hello")
})

module.exports = router