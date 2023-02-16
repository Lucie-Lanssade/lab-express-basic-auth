const router = require('express').Router();
const isAuthenticated = require('./../middlewares/isAuthenticated');

router.get('/', isAuthenticated, (req, res, next) => {
  res.render('main');
});

module.exports = router;
