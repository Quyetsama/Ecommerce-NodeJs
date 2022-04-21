const mongoose = require('mongoose')
const Schema = mongoose.Schema



const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true,
        collection: "categories"
    }
)


const Category = mongoose.model('Category', CategorySchema)
module.exports = Category