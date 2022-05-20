const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')



// Passport jwt
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: process.env.JWT_SECRET
}, async (jwt_payload, done) => {
    try{
        const user = await User.findById(jwt_payload.sub)

        if(!user) return done(null, false)

        done(null, user)
    }
    catch(error){
        done(error, false)
    }
}))


// Passport local
passport.use(new LocalStrategy({
    // Phai trung voi name gui len
    usernameField: 'email',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email })

        if(!user) return done(null, false)

        const isCorrectPassword = await user.isValidPassword(password)

        if(!isCorrectPassword) return done(null, false)

        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))