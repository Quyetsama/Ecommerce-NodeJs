const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs') 


const UserSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String
        },
        authGoogleID: {
            type: String,
            default: null
        },
        authFacebookID: {
            type: String,
            default: null
        },
        authType: {
            type: String,
            enum: ['local', 'google', 'facebook'],
            default: 'local'
        },
        role: {
            type: String,
            default: 'user'
        },
        tokenDevices: {
            type: Array,
            default: []
        },
        coin: {
            type: Number,
            default: 0
        },
        favorite: [{
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }],
        shop: {
            type: Schema.Types.ObjectId,
            ref: 'Shop'
        }
        // shopName: {
        //     type: String,
        //     default: null
        // }
    },
    {
        timestamps: true,
        collection: "users"
    }
)

UserSchema.pre('save', async function(next){
    try {
        if(this.authType != 'local') next()

        // Generate a satl
        const satl = await bcrypt.genSalt(10)
        // Generate a password hash (satl + hash)
        const passwordHashed = await bcrypt.hash(this.password, satl)
        // Re-assign password hashed
        this.password = passwordHashed

        next()
    } catch (error) {
        next(error)
    }
})


UserSchema.methods.isValidPassword = async function(newPassword){
    try {
        return await bcrypt.compare(newPassword, this.password)
    } catch (error) {
        throw new Error(error)
    }
}


const User = mongoose.model('User', UserSchema)
module.exports = User