'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnusurer = require('./authentication-ensurer');
const uuid = require('node-uuid');
const Schedule = require('../models/schedule');
const Candidate = require('../models/candidate');

router.get('/new', authenticationEnusurer, (req, res, next) => {
  res.render('new', { user: req.user });
});

router.post('/', authenticationEnusurer, (req, res, next) => {
  const scheduleId = uuid.v4();
  const updatedAt = new Date();
  Schedule.create({
    scheduleId: scheduleId,
    scheduleName: req.body.scheduleName.slice(0, 255),
    memo: req.body.memo,
    createdBy: req.user.id,
    updatedAt: updatedAt
  }).then((schedule) => {
    const candidateNames = req.body.candidates.trim()
      .split('\n')
      .map(s => s.trim())
      .filter(s => s !== '');
    const candidates = candidateNames.map(c => ({
      candidateName: c,
      scheduleId: schedule.scheduleId
    }));
    Candidate.bulkCreate(candidates).then(() => {
      res.redirect('/schedules/' + schedule.scheduleId);
    });
  });
});

module.exports = router;