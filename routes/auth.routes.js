const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const bcrypt = require('bcryptjs');

//renders the signup page
router.get('/signup', async (req, res, next) => {
  res.render('auth/signup');
});
//parses the input passed into the form and checks wether
//authentificaition conditions are met or not
router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    //if one field is missing, display an error message and render the signup page again
    if (!username || !password) {
      return res.render('auth/signup', {
        errorMessage:
          'Missing field: please fill out username and password to proceed',
      });
    }

    //checks wether the user already exists or not.If a user already exists, display an error message and render the signup page again.
    const foundUser = await User.findOne({ username: username });
    if (foundUser) {
      return res.render('auth/signup', {
        errorMessage:
          'You already have an account, please login on the next page',
      });
    }

    //Hashes the password and creates a new user with username and password.Redirects to the login page.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userToCreate = {
      username,
      password: hashedPassword,
    };
    const userFromDb = await User.create(userToCreate);

    res.redirect('login');
  } catch (error) {
    next(error);
  }
});

//renders the login page
router.get('/login', async (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.render('auth/login', {
        errorMessage:
          'Missing field: please fill out username and password to proceed',
      });
    }

    // console.log(username, password);
    const foundUser = await User.findOne(
      { username },
      { password: 1, username: 1 }
    );
    if (!foundUser) {
      return res.render('auth/login', {
        errorMessage: 'This account does not exist. Please sign up first.',
      });
    }

    // console.log(foundUser);
    //checks if the input password matches the hashed password stored in the database
    const matchingPass = await bcrypt.compare(password, foundUser.password);
    if (!matchingPass) {
      return res.render('auth/login', {
        errorMessage: 'wrong password. Please try again',
      });
    }
    //console.log(matchingPass);
    // ! We are safe to login the user!

    //adds the currentUser property to the session object
    req.session.currentUser = foundUser;

    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }
    res.redirect('login');
  });
});

module.exports = router;
