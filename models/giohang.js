const db = require("../db.js")

class giohang{
    constructor (id, soluong, dongia, ngaydat, ngaygiao, mahang) {
        this.id = id;
        this.soluong = soluong;
        this.dongia = dongia;
        this.ngaydat = ngaydat;
        this.ngaygiao = ngaygiao;
        this.mahang = mahang;
    }
}