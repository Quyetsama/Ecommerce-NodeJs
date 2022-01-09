const router = require('express-promise-router')()
const categoryController = require('../controllers/CategoryController')
const { validateParam, validateBody, schemas } = require('../helpers/routerHelpers')
const passport = require('passport')
const passportConfig = require('../middlewares/passport')




router.get('/', categoryController.index)
router.post('/create', validateBody(schemas.categorySchema), categoryController.newCategory)




module.exports = router