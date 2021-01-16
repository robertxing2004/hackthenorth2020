var {Pool} = require('pg');
var fs = require('fs');
var properties = require('./properties');
const { timeStamp } = require('console');

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
async function test() {
    let client = await pool.connect();
    let query = await client.query('SELECT * FROM users;');
    console.log(query.rows);
    await client.release();
}
test();

module.exports = pool;