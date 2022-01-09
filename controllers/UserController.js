const User = require('../models/User')
const JWT = require('jsonwebtoken')



const encodedToken = (userID) => {
    return JWT.sign({
        iss: 'quyetsama',
        sub: userID,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    }, process.env.JWT_SECRET)
}

const index = async (req, res, next) => {
    const users = await User.find({})
    return res.status(200).json({ users })
}

const newUser = async (req, res, next) => {
    const newUser = await User.create(req.body)
    return res.status(201).json({ newUser })
}

const signUp = async (req, res, next) => {
    const { fullName, email, password } = req.value.body
    // Check email same
    const foundUser = await User.findOne({ email })
    if(foundUser) return res.status(403).json({ error: { message: 'Email is already in use' } })

    // New user
    const newUser = await User.create({ fullName, email, password })

    const token = encodedToken(newUser._id)
    res.setHeader('Authorization', 'bearer ' + token)

    return res.status(201).json({ success: true, token: 'bearer ' + token })
}

const signIn = async (req, res, next) => {
    const token = encodedToken(req.user._id)

    res.setHeader('Authorization', 'bearer ' + token)
    return res.status(200).json({ success: true, token })
}

const secret = (req, res, next) => {
    // console.log(req.user.firstName)
    return res.status(200).json({ profile: req.user })
}

module.exports = { 
    index,
    newUser,
    signIn,
    secret,
    signUp
}