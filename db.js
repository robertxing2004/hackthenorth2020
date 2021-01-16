var {Pool} = require('pg');
var fs = require('fs');
var properties = require('./properties');

var config = {
    user: 'hackathon',
    host : 'free-tier.gcp-us-central1.cockroachlabs.cloud',
    database: 'silly-camel-212.defaultdb',
    password: properties.pgPassword,
    port: 26257,
    ssl: {
        ca: fs.readFileSync('cc-ca.crt').toString()
    }
  };

var pool = new Pool(config);
/*pool.connect(async (err, client, done) => {
    if (err) throw err;
    var e = await client.query('SELECT * FROM test');
    console.log(e);
    done();
    process.exit();
});*/

module.exports = pool;