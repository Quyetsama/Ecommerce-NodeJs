const Order = require('../models/Order')
const OrderInfo = require('../models/OrderInfo')
const User = require('../models/User')
const Voucher = require('../models/Voucher')
const Notify = require('../models/Notify')
const NotifyController = require('./NotifyController')
const moment = require('moment')


const makeid = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
   return result
}

const index = async (req, res, next) => {
    
    const orders = await Order.find(
        { user: req.user._id, status: req.params.status },
        { code: 1, ordersInfo: 1, total: 1, createdAt: 1 }
    )
    return res.status(200).json({
        success: true,
        orders 
    })
}

const deliveringOrder = async (req, res, next) => {

    const { id } = req.body

    const newOrder = await Order.findByIdAndUpdate(id, {
        status: 1
    }, {new : true}).populate('user', '_id tokenDevices')

    const newNotify = await Notify.create(new Notify({
        title: 'Đã xác nhận đơn hàng',
        subTitle: 'Kiểm tra đi em :))',
        body: 'Đơn hàng của bạn đã được xác nhận, chờ nhận hàng nhé <3', 
        image: 'https://images.unsplash.com/photo-1649859398731-d3c4ebca53fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        type: 1,
        user: newOrder.user._id
    }))

    const msg = await NotifyController.sendtoUser(
        newOrder.user.tokenDevices,
        {
            title: newNotify.title,
            subTitle: newNotify.subTitle,
            body: newNotify.body, 
            image: newNotify.image,
            color: '#CC0033'
        }
    )

    return res.status(201).json({
        success: true,
        // newOrder,
        newNotify
        // msg
    })
}

const deliveredOrder = async (req, res, next) => {

    const { id } = req.body

    const newOrder = await Order.findByIdAndUpdate(id, {
        status: 2,
        deliveryTime: moment().format()
    }, {new : true}).populate('user', '_id tokenDevices')

    const newNotify = await Notify.create(new Notify({
        title: 'Đơn hàng đã được giao',
        subTitle: 'Kiểm tra đi em :))',
        body: 'Đơn hàng của bạn đã được giao', 
        image: 'https://images.unsplash.com/photo-1649859398731-d3c4ebca53fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        type: 2,
        user: newOrder.user._id
    }))

    const msg = await NotifyController.sendtoUser(
        newOrder.user.tokenDevices,
        {
            title: newNotify.title,
            subTitle: newNotify.subTitle,
            body: newNotify.body, 
            image: newNotify.image,
            color: '#CC0033'
        }
    )


    return res.status(201).json({
        success: true,
        newOrder,
        msg
    })
}

const newOrder = async (req, res, next) => {

    const { bill, products, contact, address } = req.body

    // console.log({ bill, products, contact, address })

    await User.updateOne({ _id: req.user._id }, { $inc: { coin: -bill.coin } })
    await Voucher.updateOne({ _id: bill.voucher }, { $addToSet: { used: req.user._id } })

    const newOrderInfo = await OrderInfo.insertMany(products)

    const listId = newOrderInfo.map(item => item._id)

    const newOrder = new Order({
        code: makeid(7).toLocaleUpperCase(),
        user: req.user._id,
        contact: {...contact},
        address: {...address},
        ordersInfo: listId,
        price: bill.price,
        transportFee: bill.transportFee,
        discount: bill.discount,
        total: bill.total
    })
    await newOrder.save()

    return res.status(201).json({ 
        success: true,
        newOrder
    })
}

const detailOrder = async (req, res, next) => {

    const orderFound = await Order.findOne({
        _id: req.params.id,
        user: req.user._id
    }).populate({
        path: 'ordersInfo',
        model: 'OrderInfo',
        populate: {
            path: 'product',
            model: 'Product',
            select: { '_id': 1, 'name': 1, 'image': { $first: '$image' }},
        }
    })

    return res.status(200).json({
        success: true,
        data: orderFound
    })
}

module.exports = { 
    index,
    deliveringOrder,
    deliveredOrder,
    newOrder,
    detailOrder
}