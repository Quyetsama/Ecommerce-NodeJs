const mongoose = require('mongoose')
const Schema = mongoose.Schema



const ShopSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        collection: "shops"
    }
)


const Shop = mongoose.model('Shop', ShopSchema)
module.exports = Shop