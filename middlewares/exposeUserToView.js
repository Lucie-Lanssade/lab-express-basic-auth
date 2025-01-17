function exposeUsers(req, res, next) {
  console.log('expose user view');
  console.log(req.session.currentUser);
  if (req.session.currentUser) {
    res.locals.currentUser = req.session.currentUser;
    res.locals.isLoggedIn = true;
  }
  next();
}

module.exports = exposeUsers;
