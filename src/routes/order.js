const router = require('express-promise-router')()
const orderController = require('../controllers/OrderController')
const passport = require('passport')
const customPassport = require('../middlewares/customPassport')
const passportConfig = require('../middlewares/passport')



router.get('/:status', customPassport.passportJWT, orderController.index)
router.post('/update/delivering', orderController.deliveringOrder)
router.post('/update/delivered', orderController.deliveredOrder)
router.post('/', customPassport.passportJWT, orderController.newOrder)
router.get('/detail/:id', customPassport.passportJWT, orderController.detailOrder)


module.exports = router