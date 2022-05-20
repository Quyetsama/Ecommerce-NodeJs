const userRouter = require('./user')
const categoryRouter = require('./category')
const productRouter = require('./product')
const voucherRouter = require('./voucher')
const orderRouter = require('./order')
const notificationRouter = require('./notification')


const route = (app) => {

    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/category', categoryRouter)
    app.use('/api/v1/product', productRouter)
    app.use('/api/v1/voucher', voucherRouter)
    app.use('/api/v1/order', orderRouter)
    app.use('/api/v1/notification', notificationRouter)
    
    app.get('/', (req, res, next) => {
        setTimeout(() => {
            return res.status(200).json({
                success: true,
                message: 'Server is ok!'
            })
        }, 3000)
    })

    app.use((req, res, next) => {
        const err = new Error('Not Found')
        err.status = 404
        next(err)
    })
    
    app.use((err, req, res, next) => {
        console.log(err)
        const status = err.status || 500
        return res.status(status).json({
            error: {
                message: err.message
            }
        })
    })
}

module.exports = route