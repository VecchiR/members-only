const router = require('express').Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const { registerValidation } = require('../middleware/userValidation');

router.get('/', (req, res) => {
    const isAuth = req.isAuthenticated();
    res.render("login-status", {isAuth});
});


router.get('/login', (req, res, next) => {
    res.render("login-form");
} );

router.post('/login', passport.authenticate('local', { failureRedirect: '/', successRedirect: '/' }));

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});



router.get('/register', (req, res, next) => {
    res.render("register-form");
});

router.post('/register', registerValidation, userController.createUser);






module.exports = router;