const mongoose = require('mongoose')
const Schema = mongoose.Schema



const OrderInfoSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        classify: {
            type: Array,
            default: []
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        rating: {
            type: Number,
            default: null
        },
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        },
    },
    {
        timestamps: true,
        collection: "orderinfos"
    }
)


const OrderInfo = mongoose.model('OrderInfo', OrderInfoSchema)
module.exports = OrderInfo