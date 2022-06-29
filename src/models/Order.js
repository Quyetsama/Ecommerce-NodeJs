const mongoose = require('mongoose')
const Schema = mongoose.Schema



const OrderSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        contact: {
            name: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true
            }
        },
        address: {
            province: {
                type: String,
                required: true,
            },
            district: {
                type: String,
                required: true,
            },
            ward: {
                type: String,
                required: true,
            },
            street: {
                type: String,
                required: true,
            },
        },
        ordersInfo: [{
            type: Schema.Types.ObjectId,
            ref: 'OrderInfo'
        }],
        status: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: true
        },
        transportFee: {
            type: Number,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true
        },
        deliveryTime: {
            type: Date,
            default: null
        },
        rating: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        collection: "orders"
    }
)


const Order = mongoose.model('Order', OrderSchema)
module.exports = Order