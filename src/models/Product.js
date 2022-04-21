const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate-v2')



const ProductSchema = new Schema(
    {
        name: {
            type: String,
            index: true,
            required: true
        },
        image: {
            type: Array
        },
        description: {
            type: String,
            required: true
        },
        categories: [{
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }],
        classify: Schema.Types.Mixed,
        price: {
            type: Number,
            required: true
        },
        quantity: {
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

ProductSchema.plugin(mongoosePaginate)


const Product = mongoose.model('Product', ProductSchema)
module.exports = Product