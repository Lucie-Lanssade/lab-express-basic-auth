function isAuthenticated(req, res, next) {
  console.log('authenticated middleware');
  if (req.session.currentUser) {
    console.log('is authenticated');
    next();
  } else {
    res.redirect('auth/login');
  }
}

module.exports = isAuthenticated;
