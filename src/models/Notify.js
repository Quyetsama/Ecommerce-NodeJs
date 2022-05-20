const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs') 


const NotifySchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        subTitle: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        type: {
            type: Number,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        read: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        collection: "notifies"
    }
)



const Notify = mongoose.model('Notify', NotifySchema)
module.exports = Notify