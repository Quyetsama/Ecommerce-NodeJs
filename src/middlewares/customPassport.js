const passport = require('passport')


const passportJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            const err = {}
            // err.status = 401;
            err.success = false
            err.message = 'Unauthorized'
    
            return res.status(401).json(err) // send the error response to client
        }
        req.user = user
        return next() // continue to next middleware if no error.
    })(req, res, next) /* passport.authentication returns a function,
                            we invoke it with normal req..res arguments 
                            to override default functionality */ 
}

const notRequirePassportJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (user) {
            req.user = user
        }
        return next() // continue to next middleware if no error.
    })(req, res, next) /* passport.authentication returns a function,
                            we invoke it with normal req..res arguments 
                            to override default functionality */ 
}

const passportLocal = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            const err = {}
            err.success = false
            err.message = 'Your email or password incorrect.'

    
            return res.status(401).json(err)
        }
        req.user = user
        return next()
    })(req, res, next)
}

module.exports = {
    passportJWT,
    notRequirePassportJWT,
    passportLocal
}