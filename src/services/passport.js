const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user')

module.exports = (passport) => {
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, (jwtPayload, done) => {
        try {
            User.findOne({ _id: jwtPayload._id }).then(user => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "User not found." });
                }
            })
        } catch (error) {
            done(error, null)
        }
    }))
}