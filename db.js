var {Pool} = require('pg');
var fs = require('fs');
var properties = require('./properties');
const { timeStamp } = require('console');

var config = {
    user: 'user',
    host: 'trusty-lemur-8c3.gcp-northamerica-northeast1.cockroachlabs.cloud',
    database: 'defaultdb',
    password: properties.pgPassword,
    port: 26257,
    ssl: {
        ca: fs.readFileSync('cc-ca.crt').toString()
    }
  };

var pool = new Pool(config);
async function test() {
    let client = await pool.connect();
    await client.query('SET search_path TO scott;');
    let query = await client.query('SELECT * FROM users;');
    console.log(query.rows);
    await client.release();
}
test();

module.exports = pool;