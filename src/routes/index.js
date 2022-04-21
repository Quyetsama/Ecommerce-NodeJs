const userRouter = require('./user')
const categoryRouter = require('./category')
const productRouter = require('./product')
const voucherRouter = require('./voucher')
const orderRouter = require('./order')


const route = (app) => {

    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/category', categoryRouter)
    app.use('/api/v1/product', productRouter)
    app.use('/api/v1/voucher', voucherRouter)
    app.use('/api/v1/order', orderRouter)
    
    app.get('/', (req, res, next) => {
        return res.status(200).json({
            success: true,
            message: 'Server is ok!'
        })
    })

    app.use((req, res, next) => {
        const err = new Error('Not Found')
        err.status = 404
        next(err)
    })
    
    app.use((err, req, res, next) => {
        const status = err.status || 500
        return res.status(status).json({
            error: {
                message: err.message
            }
        })
    })
}

module.exports = route