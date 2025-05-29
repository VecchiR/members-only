const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { validPassword } = require('../lib/passwordUtils');
const usersDb = require('./userQueries');

const verifyCallback = (username, password, done) => {
    usersDb.getUserByUsername(username)
        .then((user) => {
            try {
                if (!user) { return done(null, false) }

                const isValid = validPassword(password, user.hash, user.salt);

                if (isValid) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } catch (error) {
                console.log('i got here');
            }

        })
        .catch((err) => {
            done(err);
        });
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    usersDb.getUserById(userId)
        .then((user) => {
            done(null, Array.isArray(user) ? user[0] : user);
        })
        .catch(err => done(err));
});