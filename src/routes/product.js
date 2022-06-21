const router = require('express-promise-router')()
const productController = require('../controllers/ProductController')
const { validateParam, validateBody, schemas } = require('../helpers/routerHelpers')
const passport = require('passport')
const passportConfig = require('../middlewares/passport')
const customPassport = require('../middlewares/customPassport')


router.get('/test', productController.test)


router.get('/', productController.index)
router.post('/create', passport.authenticate('jwt', { session: false }), productController.newProduct)

router.get('/search', productController.searchProduct)
router.get('/suggest', productController.suggestProduct)
router.get('/related', productController.getProductRelated)
router.get('/selling', productController.getProductSelling)
router.get('/price', productController.getProductPriceUpDown)
router.get('/filter', productController.searchFilter)
router.get('/rate', productController.rateProduct)
router.get('/demo', productController.demo)
router.get('/:idCategory', productController.getProductsByCategories)


router.get('/detail/:id', customPassport.notRequirePassportJWT, productController.getProductByID)
router.get('/classify/:id', productController.getClassifyProductByID)



module.exports = router