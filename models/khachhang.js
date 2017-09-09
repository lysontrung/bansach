const db = require(".././db.js");
const { hash, compare } = require('bcrypt');
const bcrypt = require('bcrypt');


class khachhang{
    constructor (hoten, taikhoan, matkhau, email, id) {
        this.hoten = hoten;
        this.taikhoan = taikhoan;
        this.matkhau = matkhau;
        this.email = email;
        this.id = id;
    }
    
    async signUp(cb) {
        const sql = 'INSERT INTO "khachhang"(hoten, taikhoan, matkhau, email) VALUES ($1, $2, $3, $4);'
        const encrypted = await hash(this.matkhau, 8);
        db(sql, [this.hoten, this.taikhoan, encrypted, this.email], (err, result) => {
            if(err) return cb(err, null);
            cb(null, result);
        });
    }

    async signIn(cb) {
        const sql = 'SELECT * FROM "khachhang" WHERE taikhoan = $1';
        db(sql, [this.taikhoan], (err, result) => {
            if (!result.rows[0]) throw new Error('tai khoản không tồn tại');
            const hashPass = result.rows[0].matkhau;
            const isValid = compare(this.matkhau, hashPass);
            if (!isValid) throw new Error('Sai password');
            return { taikhoan: this.taikhoan, hoten: result.rows[0].hoten };
        });
    }
}

module.exports = khachhang;