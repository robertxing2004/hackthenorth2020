var express = require('express');
var axios = require('axios');
var router = express.Router();

var properties = require('../properties');
var pool = require('../db');

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
    let client = await pool.connect();
    let query = await client.query('SELECT * FROM users WHERE id=$1 LIMIT 1;', [data.login]);
    if (query.rowCount === 0) await client.query('INSERT INTO users(id, name) VALUES ($1, $2);', [data.login, data.name]);
    await client.release();
    console.log(req.session.userid);
    console.log("Logged in\n********\n\n\n\n");
  }).
  then(() => {
    res.redirect('/users');
  }).
  catch(err => res.status(500).json({ message: err.message }));
})

module.exports = router;
