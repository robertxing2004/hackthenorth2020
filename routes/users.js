var express = require('express');
var axios = require('axios');
var router = express.Router();

var properties = require('../properties');
var pool = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    res.render('users', {
      username: req.session.username,
      userid: req.session.userid
    });
  }
});

router.post('/group', function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    console.log(req.body.groupid);
    res.render('group', {
      userid: req.session.userid,
      groupname: req.body.groupname,
      groupid: req.body.groupid,
      groupnum: req.body.groupnum
    });
  }
});

router.post('/event', function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    res.render('event', {
      userid: req.session.userid,
      eventname: req.body.eventname,
      eventdescription: req.body.eventdescription,
      eventid: req.body.eventid,
      start: req.body.start,
      num: req.body.num
    });
  }
});

router.all('/login', function(req, res, next) {
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
    req.session.username = data.name;
    let client = await pool.connect();
    await client.query('SET search_path TO scott;');
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



/*-----------------


// API ENDPOINTS


-------------------*/


/*
User endpoints
*/

router.post('/searchusers', async function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    try {
      let client = await pool.connect();
      await client.query('SET search_path TO scott;');
      let query = await client.query(
        `SELECT * FROM users WHERE id LIKE '%' || $1 || '%' OR name LIKE '%' || $1 || '%';`,
        [req.body.search]
        );
      console.log(query.rows);
      if (query.rowCount === 0) throw {message: "No users found!"};
      await client.release();
      res.send(query.rows);
    }
    catch(err) {
      console.log(err);
      res.send([]);
    }
  }
});


/*
Group endpoints
*/

router.post('/creategroup', async function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    try {
      let client = await pool.connect();
      await client.query('SET search_path TO scott;');
      let query = await client.query(
        'SELECT * FROM group_user WHERE userid=$1 AND groupname=$2 LIMIT 1;',
        [req.session.userid, req.body.groupname] //note this
        );
      if (query.rowCount > 0) throw {message: "Group with this name already exists!"};
      query = (await client.query('INSERT INTO groups(name, num) VALUES($1, 1) RETURNING *;', [req.body.groupname])).rows[0];
      await client.query(
        'INSERT INTO group_user(groupid, userid, groupname) VALUES($1, $2, $3)',
        [query.id, req.session.userid, query.name]
        );
      await client.release();
      res.send({message: "Group created!"});
    }
    catch(err) {
      console.log(err);
      res.send(err);
    }
  }
});

router.get('/getgroups', async function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    try {
      let client = await pool.connect();
      await client.query('SET search_path TO scott;');
      let query = await client.query(
        'SELECT * FROM group_user WHERE userid=$1;',
        [req.session.userid]
        );
      if (query.rowCount === 0) throw {message: "No groups found!"};
      let groups = [];
      for (g_u of query.rows) {
        let group = (await client.query('SELECT * FROM groups WHERE id=$1 LIMIT 1;', [g_u.groupid])).rows[0];
        groups.push(group);
      }
      await client.release();
      res.send(groups);
    }
    catch(err) {
      console.log(err);
      res.send([]);
    }
  }
});

router.post('/getgroupusers', async function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    try {
      let client = await pool.connect();
      await client.query('SET search_path TO scott;');
      let query = await client.query(
        `SELECT * FROM group_user WHERE groupid=$1;`,
        [req.body.groupid]
        );
      if (query.rowCount === 0) throw {message: "No users found!"};
      let users = [];
      for (i of query.rows) {
        let u = (await client.query(
          'SELECT * FROM users WHERE id=$1 LIMIT 1;', [i.userid]
        )).rows[0];
        console.log(u);
        users.push(u);
      }
      await client.release();
      res.send(users);
    }
    catch(err) {
      console.log(err);
      res.send([]);
    }
  }
});

/*router.get('/testcreategroup', async function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    try {
      let client = await pool.connect();
      let query = await client.query(
        'SELECT * FROM group_user WHERE userid=$1 AND groupname=$2',
        [req.session.userid, 'test'] //note this
        );
      if (query.rowCount > 0) throw {message: "Group with this name already exists!"};
      query = (await client.query('INSERT INTO groups(name) VALUES($1) RETURNING *;', ['test'])).rows[0];
      console.log(query);
      await client.query(
        'INSERT INTO group_user(groupid, userid, groupname) VALUES($1, $2, $3)',
        [query.id, req.session.userid, query.name]
        );
      await client.release();
      res.send({message: "Group created!"});
    }
    catch(err) {
      console.log(err);
      res.send(err)
    }
  }
});*/

router.post('/deletegroup', async function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    try {
      let client = await pool.connect();
      await client.query('SET search_path TO scott;');
      let query = await client.query(
        'SELECT * FROM group_user WHERE userid=$1 AND groupid=$2 LIMIT 1',
        [req.session.userid, req.body.groupid]
        );
      if (query.rowCount === 0) throw {message: "Group not found!"};
      await client.query(
        'DELETE FROM group_user WHERE userid=$1 AND groupid=$2 LIMIT 1',
        [req.session.userid, req.body.groupid]
        );
      
      console.log(query.rows);
      if (query.rowCount <= 2) {
        await client.query('DELETE FROM groups WHERE id=$1;', [req.body.groupid]);
        query = await client.query(
          'SELECT * FROM events WHERE groupid=$1',
          [req.body.groupid]
        );
        for (evt of query.rows) {
          await client.query('DELETE FROM availabilities WHERE eventid=$1', [evt.id]);
          await client.query('DELETE FROM events WHERE id=$1', [evt.id]);
        }
      }
      await client.release();
      res.send({message: 'Deleted group!'});
    }
    catch(err) {
      console.log(err);
      res.send(err);
    }
  }
});

router.post('/addtogroup', async function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    try {
      let client = await pool.connect();
      await client.query('SET search_path TO scott;');
      let query = await client.query(
        'SELECT * FROM group_user WHERE groupid=$1 AND userid=$2 LIMIT 1;',
        [req.body.groupid, req.body.userid] //note this
        );
      if (query.rowCount > 0) throw {message: "User already in this group!"};
      await client.query('UPDATE groups SET num=num+1 WHERE id=$1', [req.body.groupid]);
      await client.query(
        'INSERT INTO group_user(groupid, userid, groupname) VALUES($1, $2, $3);',
        [req.body.groupid, req.body.userid, req.body.groupname]
        );
      await client.release();
      res.send({message: "Added user to group!"});
    }
    catch(err) {
      console.log(err);
      res.send(err);
    }
  }
});


/*
Event endpoints
*/


router.post('/createevent', async function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    console.log('**********\n\ncreating event\n\n***********');
    try {
      let client = await pool.connect();
      await client.query('SET search_path TO scott;');
      let query = await client.query(
        'SELECT * FROM events WHERE groupid=$1 AND name=$2 LIMIT 1;',
        [req.body.groupid, req.body.eventname] // note this
        );
      if (query.rowCount > 0) throw {message: "Event with this name already exists!"};
      let start = (req.body.start) ? req.body.start : (await client.query('SELECT current_date;')).rows[0].current_date;
      await client.query(
        'INSERT INTO events(name, description, groupid, start) VALUES($1, $2, $3, $4);',
        [req.body.eventname, req.body.description, req.body.groupid, start]
        );
      await client.release();
      res.send({message: "Event created!"});
    }
    catch(err) {
      console.log(err);
      res.send(err);
    }
  }
});

router.post('/getevents', async function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    try {
      let client = await pool.connect();
      await client.query('SET search_path TO scott;');
      let query = await client.query(
        'SELECT * FROM events WHERE groupid=$1;',
        [req.body.groupid]
        );
      if (query.rowCount === 0) throw {message: "No events found for this group!"};
      await client.release();
      res.send(query.rows);
    }
    catch(err) {
      console.log(err);
      res.send(err)
    }
  }
});

/*router.get('/testcreateevent', async function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    try {
      let client = await pool.connect();
      let query = await client.query(
        'SELECT * FROM events WHERE groupid=$1 AND name=$2;',
        [625043619862488849, 'testevent'] // note this
        );
      if (query.rowCount > 0) throw {message: "Event with this name already exists!"};
      let start = (req.body.start) ? req.body.start : (await client.query('SELECT current_date;')).rows[0].current_date;
      console.log(start);
      await client.query(
        'INSERT INTO events(name, description, groupid, start) VALUES($1, $2, $3, $4);',
        ['testevent', 'testing event for testing purposes', 625043619862488849, start]
        );
      await client.release();
      res.send({message: "Event created!"});
    }
    catch(err) {
      console.log(err);
      res.send(err)
    }
  }
});*/

router.post('/deleteevent', async function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    try {
      let client = await pool.connect();
      await client.query('SET search_path TO scott;');
      let query = await client.query(
        'SELECT * FROM events WHERE id=$1;',
        [req.body.eventid]
        );
      if (query.rowCount === 0) throw {message: "Event not found!"};

      query = await client.query(
        'SELECT * FROM group_user WHERE groupid=$1 AND userid=$2',
        [query.rows[0].id, req.session.userid]
        );
      if (query.rowCount === 0) throw {message: "Not part of this group!"};
      await client.query('DELETE FROM events WHERE id=$1;', [req.body.eventid]);
      await client.query('DELETE FROM availabilities WHERE eventid=$1', [req.body.eventid]);
      await client.release();
      res.send({message: 'Deleted event!'});
    }
    catch(err) {
      console.log(err);
      res.send(err);
    }
  }
});


/*
Availability endpoints
*/


router.post('/toggleavailability', async function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    try {
      let client = await pool.connect();
      await client.query('SET search_path TO scott;');
      let query = await client.query(
        'SELECT * FROM availabilities WHERE userid=$1 AND eventid=$2 AND delta=$3 LIMIT 1;',
        [req.session.userid, req.body.eventid, req.body.delta] // note this
        );
      if (query.rowCount > 0) {
        await client.query(
          'DELETE FROM availabilities WHERE userid=$1 AND eventid=$2 AND delta=$3;',
          [req.session.userid, req.body.eventid, req.body.delta]
          );
        await client.release();
        res.send({message: "Removed availability!"});
      }
      else {
        await client.query(
          'INSERT INTO availabilities(userid, eventid, delta) VALUES($1, $2, $3);',
          [req.session.userid, req.body.eventid, req.body.delta]
          );
        await client.release();
        res.send({message: "Marked day as available!"});
      }
    }
    catch(err) {
      console.log(err);
      res.send(err)
    }
  }
});

router.post('/getavailabilities', async function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    try {
      let client = await pool.connect();
      await client.query('SET search_path TO scott;');
      let query = await client.query(
        'SELECT * FROM availabilities WHERE eventid=$1;',
        [req.body.eventid]
        );
      if (query.rowCount === 0) throw {message: "No availabilities for this event!"};
      await client.release();
      res.send(query.rows);
    }
    catch(err) {
      console.log(err);
      res.send([])
    }
  }
});

/*router.get('/testtoggleavailability', async function(req, res, next) {
  if (!req.session.userid) res.redirect('/users/login');
  else {
    try {
      let client = await pool.connect();
      let query = await client.query(
        'SELECT * FROM availabilities WHERE userid=$1 AND eventid=$2 AND delta=$3;',
        [req.session.userid, 625052230736553745, 3] // note this
        );
      if (query.rowCount > 0) {
        await client.query(
          'DELETE FROM availabilities WHERE userid=$1 AND eventid=$2 AND delta=$3;',
          [req.session.userid, 625052230736553745, 3]
          );
        res.send({message: "Marked day as unavailable!"});
      }
      else {
        await client.query(
          'INSERT INTO availabilities(userid, eventid, delta) VALUES($1, $2, $3);',
          [req.session.userid, 625052230736553745, 3]
          );
        res.send({message: "Marked day as available!"});
      }
      await client.release();
    }
    catch(err) {
      console.log(err);
      res.send(err)
    }
  }
});*/

module.exports = router;
