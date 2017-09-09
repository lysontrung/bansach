const pg = require('pg');

const pool = new pg.Pool({
    host : 'localhost',
    port: 5432,
    database: 'bansach',
    user: 'postgres',
    password: 'diablos11',
    max: 20,
    idleTimeoutMillis: 1000
})

function db(sql, arrayData, cb) {
    pool.connect((err, client, done) => {
        if (err) return cb(err, null);
        client.query(sql, arrayData, (errQuery, result) => {
            done();
            if (errQuery) return cb(errQuery, null);
            cb(null, result);
        });
    });
}

module.exports = db;

