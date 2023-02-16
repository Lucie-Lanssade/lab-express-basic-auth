const router = require('express').Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/profile', (req, res, next) => {
  res.render('profile');
});

router.use('/auth', require('./auth.routes'));
router.use('/user', require('./user.routes'));
router.use('/main', require('./main.routes'));
router.use('/private', require('./private.routes'));
module.exports = router;
