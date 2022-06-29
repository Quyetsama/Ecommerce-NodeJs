const User = require('../models/User')
const Shop = require('../models/Shop')
const Notify = require('../models/Notify')
const JWT = require('jsonwebtoken')



const encodedToken = (userID) => {
    return JWT.sign({
        iss: 'quyetsama',
        sub: userID,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    }, process.env.JWT_SECRET)
}

// const encodedToken = (userID) => {
//     return JWT.sign({
//         sub: userID
//     }, process.env.JWT_SECRET, { expiresIn: '15s' })
// }

const index = async (req, res, next) => {
    const users = await User.find({})
    return res.status(200).json({ users })
}

const newUser = async (req, res, next) => {
    const newUser = await User.create(req.body)
    return res.status(201).json({ newUser })
}

const signUp = async (req, res, next) => {
    const { fullName, email, password, tokenDevice } = req.value.body
    // Check email same
    const foundUser = await User.findOne({ email })
    if(foundUser) return res.status(403).json({
        success: false,
        message: 'Email is already in use'
    })

    // New user
    const user = new User({
        fullName,
        email,
        password,
        tokenDevices: [tokenDevice]
    })
    const newUser = await User.create(user)

    const token = encodedToken(newUser._id)
    res.setHeader('Authorization', 'bearer ' + token)

    return res.status(201).json({ 
        success: true,
        data: {
            fullName,
            email,
            coin: 0
        }
    })
}

const signIn = async (req, res, next) => {
    const { tokenDevice } = req.body
    await User.updateOne(
        { _id: req.user._id },
        { $addToSet: { tokenDevices: tokenDevice } }
    )

    const token = encodedToken(req.user._id)

    const profile = {
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        coin: req.user.coin,
        // role: req.user.role,
        // favorite: req.user.favorite,
        // shopName: req.user.shopName
    }

    res.setHeader('Authorization', 'bearer ' + token)

    setTimeout(() => {
        return res.status(200).json({ success: true, data: profile })
    }, 3000)
}

const logout = async (req, res, next) => {
    const { tokenDevice } = req.body

    await User.updateOne(
        { _id: req.user._id },
        { $pull: { tokenDevices: tokenDevice } }
    )

    return res.status(200).json({ success: true })
}

// GET user/profile
const getCurrentUser = async (req, res, next) => {

    // const user = await User.findById(req.user._id).populate('shop')

    const notify = await Notify.countDocuments(
        { 
            user: req.user._id,
            read: false
        }
    )

    const profile = {
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
        coin: req.user.coin,
        favorite: req.user.favorite,
        shop: req.user.shop
    }

    return res.status(200).json({ success: true, profile, countNotify: notify })
    // return res.status(200).json({ success: true, profile, user })
}

// POST user/createshop
const createShop = async (req, res, next) => {
    const { name, address, phone } = req.body

    const newShop = await Shop.create({
        name,
        address,
        phone
    })

    await User.updateOne({ _id: req.user._id }, {
        shop: newShop._id
    })

    return res.status(201).json({
        success: true,
        newShop
    })
}

const favoriteProduct = async (req, res, next) => {

    const { love } = req.query
    const { product } = req.body

    await User.updateOne(
        { _id: req.user._id },
        {
            ...(love === 'true' ? { $addToSet: { favorite: product } } : { $pull: { favorite: product } })
        }
    )

    return res.status(200).json({
        success: true
    })
}

const getFavorites = async (req, res, next) => {

    let user = await User.findById(req.user._id, { _id: 1 }).populate({ path: 'favorite', select: {
        _id: 1,
        name: 1,
        sold: 1,
        price: 1,
        discount: 1,
        rate: 1,
        image: { $slice: ['$image', 1] }
    }}).lean()

    let favorites = user.favorite

    return res.status(200).json({
        success: true,
        data: favorites
    })
}

const getCoin = async (req, res, next) => {

    return res.status(200).json({
        success: true,
        data: req.user.coin
    })
}

const secret = (req, res, next) => {
    console.log(req.user['password'])
    return res.status(200).json({ profile: req.user })
}

module.exports = { 
    index,
    newUser,
    signIn,
    signUp,
    logout,
    secret,
    getCurrentUser,
    createShop,
    favoriteProduct,
    getFavorites,
    getCoin
}