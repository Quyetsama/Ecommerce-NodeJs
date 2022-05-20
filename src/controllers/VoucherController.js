const Voucher = require('../models/Voucher')
const { startSession } = require('mongoose')


const index = async (req, res, next) => {

    const date = new Date()
    // console.log(new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()))
    const vouchers = await Voucher.find(
        { 
            "expired": { $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()) },
            "used": { $nin: [ req.user._id ] }
        }
    )
    return res.status(200).json({ vouchers })
}

const newVoucher = async (req, res, next) => {

    const { code, title, description, expired, classify } = req.body

    const newVoucher = await Voucher.create(new Voucher({ code, title, description, expired, classify }))
    return res.status(201).json({ newVoucher })
}

const getVoucherByCode = async (req, res, next) => {
    const { code } = req.params

    const voucher = await Voucher.findOne(
        { 
            "code": { $regex : '^' + code + '$', $options: 'i' },
            "used": { $nin: [ req.user._id ] }
        }
    )

    return res.status(200).json({
        success: true,
        data: voucher
    })
}

const storeVoucher = async (req, res, next) => {

    const session = await startSession()
    session.startTransaction()

    const newVoucher = await Voucher.findByIdAndUpdate(req.params.id, {
        $inc: { quantity: -1 },
        $addToSet: { owner: req.user._id }
    }, { session, new: true })

    if(newVoucher?.quantity < 0) {
        await session.abortTransaction()
        session.endSession()
        throw new Error('Đã hết voucher')
    }

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
        success: true
    })
}

module.exports = { 
    index,
    newVoucher,
    getVoucherByCode,
    storeVoucher
}