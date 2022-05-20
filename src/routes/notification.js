const router = require('express-promise-router')()
const notifyController = require('../controllers/NotifyController')
const customPassport = require('../middlewares/customPassport')
const passportConfig = require('../middlewares/passport')



router.post('/', notifyController.index)
router.get('/', customPassport.passportJWT, notifyController.getNotify)
router.patch('/', customPassport.passportJWT, notifyController.readNotify)
router.get('/count', customPassport.passportJWT, notifyController.countNotify)


module.exports = router