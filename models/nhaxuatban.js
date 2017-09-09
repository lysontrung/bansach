const db = require(".././db.js")

class nhaxuatban{
    constructor (tennhaxuatban, manhaxuatban) {
        this.tennhaxuatban = tennhaxuatban;
        this.manhaxuatban = manhaxuatban;
    }
    
    static getAll (cb) {
        db('SELECT * FROM "nhaxuatban"', [], (err, result) => {
            if (err) return cb(err);
            cb(null, result.rows);
        });
    }

    static getByid (manhaxuatban, cb) {
        const sql = 'SELECT * FROM "nhaxuatban" WHERE manhaxuatban =$1';
        db(sql, [manhaxuatban], (err, result) => {
            if (err) return cb(err);
            cb(null, result.rows[0]);
        });
    }

    static removeById(manhaxuatban, cb) {
        const removeSQL = 'DELETE FROM "nhaxuatban" WHERE manhaxuatban = $1';
        db(removeSQL, [manhaxuatban], (err, result) => {
          if (err) return cb(err);
            cb(null, result.rows);
        });
    }

    insert(cb) {
        const insertSQL = `INSERT INTO "nhaxuatban"(tennhaxuatban)
        VALUES ($1);`;
        db(insertSQL, [this.tennhaxuatban], (err, result) => {
            if(err) return cb(err, null);
            cb(null, result);
        });
    }

    update(cb) {
        const updateSQL = `UPDATE "nhaxuatban"
        SET tennhaxuatban=$1
        WHERE manhaxuatban = $2;`;
        db(updateSQL, [this.tennhaxuatban, this.manhaxuatban], (err, result) => {
            if(err) return cb(err, null);
            cb(null, result);
        });
    }
}

module.exports = nhaxuatban;