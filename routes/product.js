const router = require('express-promise-router')()
const productController = require('../controllers/ProductController')
const { validateParam, validateBody, schemas } = require('../helpers/routerHelpers')
const passport = require('passport')
const passportConfig = require('../middlewares/passport')


router.get('/test', productController.test)


router.get('/', productController.index)
router.post('/create', passport.authenticate('jwt', { session: false }), productController.newProduct)

router.get('/rate', productController.rateProduct)
router.get('/:idCategory', productController.getProductsByCategories)


router.get('/test/:id', productController.getProductByID)



module.exports = router