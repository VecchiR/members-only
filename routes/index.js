const router = require('express').Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const { registerValidation } = require('../middleware/userValidation');
const { requireAuth, redirectIfAuthenticated, redirectMember } = require('../middleware/authMiddleware');
const { clubValidation } = require('../middleware/clubValidation');

router.get('/', (req, res) => {
    res.render("home");
});

router.get('/login', redirectIfAuthenticated, (req, res) => {
    res.render("login-form");
});

router.post('/login', passport.authenticate('local', { 
    failureRedirect: '/', 
    successRedirect: '/' 
}));

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/register', redirectIfAuthenticated, (req, res) => {
    res.render("register-form");
});

router.post('/register', registerValidation, userController.createUser);


router.get('/join-club', redirectMember, requireAuth, (req, res) => {
    res.render("join-club");
})

router.post('/join-club', requireAuth, clubValidation, userController.makeMember);

module.exports = router;