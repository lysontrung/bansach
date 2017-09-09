const db = require("../db.js")
const nxb = require("./nhaxuatban.js")
const cd = require("./chude.js")

class sach{
    constructor (tensach, gia, anhbia, mota, machude, manhaxuatban, id) {
        this.tensach = tensach;
        this.gia = gia;
        this.anhbia = anhbia;
        this.mota = mota;
        this.machude = machude;
        this.manhaxuatban = manhaxuatban;
        this.id = id;
    }
    
    static getAll (cb) {
        db('SELECT * FROM "sach"', [], (err, result) => {
            if (err) return cb(err);
            cb(null, result.rows);
        });
    }

    static getMulti (cb) {
        db(`SELECT s.id, s.tensach, s.gia, s.anhbia, s.mota, cd.tenchude, nxb.tennhaxuatban
            FROM sach s, chude cd, nhaxuatban nxb
            WHERE s.machude = cd.machude and
            s.manhaxuatban = nxb.manhaxuatban`, [], (err, result) => {
            if (err) return cb(err);
            cb(null, result.rows);
        });
    }

    static getDetail (id, cb) {
        const sql = `SELECT s.id, s.tensach, s.gia, s.anhbia, s.mota, cd.tenchude, nxb.tennhaxuatban
            FROM sach s, chude cd, nhaxuatban nxb
            WHERE s.machude = cd.machude and
            s.manhaxuatban = nxb.manhaxuatban and
            id = $1`
        db(sql, [id], (err, result) => {
            if (err) return cb(err);
            cb(null, result.rows[0]);
        });
    }

   static getByid (id, cb) {
        const sql = 'SELECT * FROM "sach" WHERE id =$1';
        db(sql, [id], (err, result) => {
            if (err) return cb(err);
            cb(null, result.rows[0]);
        });
    }

    static getByidMulti (id, cb) {
        const sql = `SELECT s.id, s.tensach, s.gia, s.anhbia, s.mota, cd.tenchude, nxb.tennhaxuatban
            FROM sach s, chude cd, nhaxuatban nxb
            WHERE id = $1 and
            s.machude = cd.machude and
            s.manhaxuatban = nxb.manhaxuatban`;
            db(sql, [id], (err, result) => {
                if (err) return cb(err);
                cb(null, result.rows);
            });
    }

    static removeById(id, cb) {
        const removeSQL = 'DELETE FROM "sach" WHERE id = $1';
        db(removeSQL, [id], (err, result) => {
          if (err) return cb(err);
            cb(null, result.rows);
        });
    }

    insert(cb) {
        const insertSQL = 'INSERT INTO "sach"(tensach, gia, anhbia, mota, machude, manhaxuatban) VALUES ($1, $2, $3, $4, $5, $6);';
        db(insertSQL, [this.tensach, this.gia, this.anhbia, this.mota, this.machude, this.manhaxuatban], (err, result) => {
            if(err) return cb(err, null);
            cb(null, result);
        });
    }

    update(cb) {
        const updateSQL = `UPDATE public."sach"
        SET gia=$1, mota=$2
        WHERE id = $3;`;
        db(updateSQL, [this.gia, this.mota, this.id], (err, result) => {
            if(err) return cb(err, null);
            cb(null, result);
        });
    }
}

module.exports = sach;