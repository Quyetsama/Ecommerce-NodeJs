const router = require('express-promise-router')()
const voucherController = require('../controllers/VoucherController')
const passport = require('passport')
const customPassport = require('../middlewares/customPassport')
const passportConfig = require('../middlewares/passport')



router.get('/', customPassport.passportJWT, voucherController.index)
router.post('/', customPassport.passportJWT, voucherController.newVoucher)
router.get('/:code', customPassport.passportJWT, voucherController.getVoucherByCode)
router.get('/store/:id', customPassport.passportJWT, voucherController.storeVoucher)


module.exports = router