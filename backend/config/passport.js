const passport = require('passport');
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken')
const { secretOrKey } = require('./keys')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async function (email, password, done) {
    const user = await User.findOne({ email });
    if (user) {
        bcrypt.compare(password, user.hashedPassword, (err, isMatch) => {
            if (err || !isMatch) done(null, false);
            else done(null, user);
        });
    } else 
    done(null, false);
}));

exports.loginUser = async function(user) {
    const userInfo = {
        _id: user._id,
        username: user.username,
        email: user.email,
    };
    const token = await jwt.sign(userInfo, secretOrKey, { expiresIn: 3600 });
    return { userInfo, token };
}

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey;

passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload._id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (err) {
        return done(err, false);
    }
}));

exports.requireUserAuth = passport.authenticate('jwt', { session: false });

exports.restoreUser = function (req, res, next) {
    return passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) return next(err);
        if (user) req.user = user;
        next();
    })(req, res, next);
};

