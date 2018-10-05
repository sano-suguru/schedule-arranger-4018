'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnusurer = require('./authentication-ensurer');

router.get('/new', authenticationEnusurer, (req, res, next) => {
  res.render('new', { user: req.user });
});

router.post('/', authenticationEnusurer, (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;