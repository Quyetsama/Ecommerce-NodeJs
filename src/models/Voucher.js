const mongoose = require('mongoose')
const Schema = mongoose.Schema



const VoucherSchema = new Schema(
    {
        code: {
            type: String,
            unique: true,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        expired: {
            type: Date,
            required: true
        },
        // 1: discountMoney, 2: discountPercent, 3: shipMoney, 4: shipPercent
        classify: {
            type: { type: Number, required: true },
            value: { type: Number, required: true }
        },
        used: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }]
    },
    {
        timestamps: true,
        collection: "vouchers"
    }
)


const Voucher = mongoose.model('Voucher', VoucherSchema)
module.exports = Voucher