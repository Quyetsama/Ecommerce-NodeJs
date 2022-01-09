const mongoose = require('mongoose')
const Schema = mongoose.Schema



const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            type: Array
        },
        price: {
            type: Number,
            required: true
        },
        quantily: {
            type: Number,
            default: null
        },
        discount: {
            type: Number,
            min: 1,
            max: 100,
            default: null
        },
        sold: {
            type: Number,
            default: 0
        },
        transportFee: {
            type: Number,
            default: 0
        },
        rate: {
            star: { type: Number, default: 0 },
            count: { type: Number, default: 0 }
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        categories: [{
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }],
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
        collection: "products"
    }
)


const Product = mongoose.model('Product', ProductSchema)
module.exports = Product