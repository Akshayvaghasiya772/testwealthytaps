const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { userMessages } = require("../constants/messages");
const User = require("../model/user");
const { JWT_CONST } = require("../constants/authConst");

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_CONST.SECRET, // Your secret key for JWT
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const { email } = jwt_payload;
            const user = await User.findOne({ email });
            if (user) {
                return done(null, { user });
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    })
);

function authenticator(req, res, next) {
    return passport.authenticate(
        "jwt",
        { session: false },
        async (err, { user, type }, info) => {
            console.log(user)
            if (err) {
                return next(err);
            }
            if (!user || !(user?.loginToken ?? user?.authToken)) {
                res.message = userMessages.USER_UNAUTHORISED;
                return respBuilder.unAuthorized(res);
            }
            req.user = user._doc ? user._doc : user;
            req.roleId = user.roleIds[0];
            return next();
        }
    )(req, res, next);
}

module.exports = {
    authenticator,
    passport,
};
