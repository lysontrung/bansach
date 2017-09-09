const db = require("../db.js")

class chude{
    constructor (tenchude, machude) {
        this.tenchude = tenchude;
        this.machude = machude;
    }
    
    static getAll (cb) {
        db('SELECT * FROM "chude"', [], (err, result) => {
            if (err) return cb(err);
            cb(null, result.rows);
        });
    }

    static getByid (machude, cb) {
        const sql = 'SELECT * FROM "chude" WHERE machude =$1';
        db(sql, [machude], (err, result) => {
            if (err) return cb(err);
            cb(null, result.rows[0]);
        });
    }

    static removeById(machude, cb) {
        const removeSQL = 'DELETE FROM "chude" WHERE machude = $1';
        db(removeSQL, [machude], (err, result) => {
          if (err) return cb(err);
            cb(null, result.rows);
        });
    }

    insert(cb) {
        const insertSQL = 'INSERT INTO "chude"(tenchude) VALUES ($1);';
        db(insertSQL, [this.tenchude], (err, result) => {
            if(err) return cb(err, null);
            cb(null, result);
        });
    }

    update(cb) {
        const updateSQL = `UPDATE "chude"
        SET tenchude = $1
        WHERE machude = $2;`;
        db(updateSQL, [this.tenchude, this.machude], (err, result) => {
            if(err) return cb(err, null);
            cb(null, result);
        });
    }
}

module.exports = chude;