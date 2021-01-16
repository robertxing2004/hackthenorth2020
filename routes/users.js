var express = require('express');
var axios = require('axios');
var router = express.Router();

var properties = require('../properties');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    res.send('respond with a resource');
  }
});

router.get('/login', function(req, res, next) {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${properties.githubClientID}&scope=user`);
});

router.get('/confirmlogin', function(req, res, next) {
  const body = {
    client_id: properties.githubClientID,
    client_secret: properties.githubClientSecret,
    code: req.query.code
  };
  const opts = {headers: {accept: 'application/json' }};

  axios.post('https://github.com/login/oauth/access_token', body, opts).
  then(res => res.data.access_token).
  then(async token => {
    return (await axios.get('https://api.github.com/user', {headers: {authorization: `token ${token}`}})).data;
  }).
  then(async data => {
    req.session.userid = data.login;
    console.log(req.session.userid);
    console.log("Logged in");
  }).
  then(() => {
    res.redirect('/users');
  }).
  catch(err => res.status(500).json({ message: err.message }));
})

module.exports = router;
