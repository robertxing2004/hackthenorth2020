var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (!req.session.userid) res.redirect('/users/login');
    else {
      res.render('explore');
    }
  });

module.exports = router;