const router = require('express-promise-router')()
const userController = require('../controllers/UserController')
const { validateParam, validateBody, schemas } = require('../helpers/routerHelpers')
const passport = require('passport')
const customPassport = require('../middlewares/customPassport')
const passportConfig = require('../middlewares/passport')




router.get('/', userController.index)
router.post('/', userController.newUser)
router.post('/signup', validateBody(schemas.authSignUpSchema), userController.signUp)
router.post('/signin', validateBody(schemas.authSignInSchema), passport.authenticate('local', { session: false }), userController.signIn)
router.get('/profile', passport.authenticate('jwt', { session: false }), userController.getCurrentUser)
router.post('/createshop', customPassport.passportJWT, userController.createShop)
router.get('/secret', passport.authenticate('jwt', { session: false }), userController.secret)

module.exports = router