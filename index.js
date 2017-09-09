const express = require('express');
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const imageParser = require('./uploadConfig').single('anhbia');
const cookieParser = require('cookie-parser');
const { getObject, getToken } = require('./jwt');
const { redirectIfLoggedIn, checkToken } = require('./middleware');
const passport = require('passport');
const passportFb = require('passport-facebook').Strategy;
const seesion = require('express-session');

const chude = require('./models/chude');
const nhaxuatban = require('./models/nhaxuatban');
const sach = require('./models/sach');
const khachhang = require('./models/khachhang');


const app = express();
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.get('/index', (req, res) => {
    chude.getAll((err, data1) => {
        if (err) return res.send('error');
        nhaxuatban.getAll((err, data2) => {
            if (err) return res.send('error');
            sach.getAll((err, data3) => {
                if (err) return res.send('error');
                    res.render('pages/home', {chude : data1, nhaxuatban : data2, sach : data3});
            });
        })
    });
});

app.get('/private', checkToken, (req, res) => {
    res.send(req.user);
});

// ----------------------------------- khachhang

//dang ky
app.route('/dangky')
.get((req, res) => {
    res.render('pages/admin/register');
})
.post(redirectIfLoggedIn, urlencodedParser, (req, res) => {
    const { hoten, taikhoan, matkhau, email } = req.body;
    const kh = new khachhang(hoten, taikhoan, matkhau, email);
    // console.log(kh);
    kh.signUp((err, data) => {
        if (err) return res.send(err.toString());
            res.redirect('/dangnhap');
    });
});

app.route('/dangnhap')
.get((req, res) => {
    res.render('pages/admin/login')
})
.post(redirectIfLoggedIn, urlencodedParser, async (req, res) => {
    const { taikhoan, matkhau } = req.body;
    const kh = new khachhang(taikhoan, matkhau);
    try {
        const data = await kh.signIn();
        const token = await getToken({ taikhoan: data.taikhoan, email: data.email });
        res.cookie('token', token).send('Dang nhap thanh cong');
    } catch (err) {
        res.send(err.toString());
    }
});

// ----------------------------------sách
app.route('/sach')
.get((req, res) => {
    sach.getMulti((err, data) => {
        if (err) return res.send('error');
        res.render('pages/admin/sach', {sach : data})
    });
});

//them
app.route('/themsach')
.get((req, res) =>{
    chude.getAll((err, data1) => {
        if (err) return res.send(err.toString());
        nhaxuatban.getAll((err, data2) => {
        if (err) return res.send(err.toString());
            res.render('pages/admin/themsach', {chude : data1, nhaxuatban : data2});
        });
    });
})
.post(imageParser, (req, res) => {
    const { tensach, gia, mota, machude, manhaxuatban } = req.body;
    const anhbia = req.file.filename;
    const s = new sach (tensach, gia, anhbia, mota, machude, manhaxuatban);
    s.insert(err => {
        if (err) return res.send('Loi');
        res.redirect("/sach");
    });
});

// xóa
app.route('/xoasach/:id')
.get((req, res) => {
    const { id } = req.params;
    sach.removeById(id, err => {
        if (err) return res.send('Loi');
        res.redirect("/sach");
    });
});

// sua
app.route('/suasach/:id')
.get((req, res) => {
    const { id } = req.params;
    sach.getByid(id, (err, sach) => {
        if (err) return res.send('error');
        res.render('pages/admin/suasach', { sach });
    });
})
.post(urlencodedParser, (req, res) => {
    const { id } = req.params;
    const { gia, mota } = req.body;
    const s = new sach (null, gia, null, mota, null, null, id);
    s.update(err => {
        if (err) return res.send(err.toString());
        res.redirect('/sach');
    });
});

// chi tiet
app.route('/chitietsach/:id')
.get((req, res) => {
    chude.getAll((err, chude) => {
        if (err) return res.send(err.toString());
        nhaxuatban.getAll((err, nhaxuatban) => {
            if (err) return res.send(err.toString());
            const { id } = req.params;
            sach.getDetail(id, (err, sach) => {
                if (err) return res.send(err.toString());
                res.render('pages/admin/chitietsach', { chude, nhaxuatban, sach });
            });
        });
    })
});

// ----------------------------------chủ đề
app.route('/chude')
.get((req, res) => {
    chude.getAll((err, data) => {
        if (err) return res.send('error');
        res.render('pages/admin/chude', {chude : data})
    });
});

// them
app.route('/themchude')
.get((req, res) =>{
    res.render('pages/admin/themchude')
})
.post(urlencodedParser, (req, res) => {
    const cd = new chude(req.body.txtTen);
    cd.insert(err => {
        if (err) return res.send(err.toString());
        res.redirect("/chude");
    });
});

// sua
app.route('/suachude/:machude')
.get((req, res) => {
    const { machude } = req.params;
    chude.getByid(machude, (err, chude) => {
        if (err) return res.send('error');
        res.render('pages/admin/suachude', { chude });
    });
})
.post(urlencodedParser, (req, res) => {
    const { machude } = req.params;
    const cd = new chude(req.body.txtTen, machude);
    console.log(cd);
    cd.update(err => {
        if (err) return res.send(err.toString());
        res.redirect('/chude');
    });
});

// xoa
app.get('/xoachude/:machude', (req, res) => {
    const { machude } = req.params;
    chude.removeById(machude, err => {
        if (err) return res.send('Loi');
        res.redirect("/chude");
    });
});

// -------------------------------nhà xuất bản
app.route('/nhaxuatban')
.get((req, res) => {
    nhaxuatban.getAll((err, data) => {
        if (err) return res.send('error');
        res.render('pages/admin/nhaxuatban', {nhaxuatban : data})
    });
});

// them
app.route('/themnhaxuatban')
.get((req, res) =>{
    res.render('pages/admin/themnhaxuatban')
})
.post(urlencodedParser, (req, res) => {
    const nxb = new nhaxuatban(req.body.txtTen);
    nxb.insert(err => {
        if (err) return res.send(err.toString());
        res.redirect("/nhaxuatban");
    });
});

// sua
app.route('/suanhaxuatban/:manhaxuatban')
.get((req, res) => {
    const { manhaxuatban } = req.params;
    nhaxuatban.getByid(manhaxuatban, (err, nhaxuatban) => {
        if (err) return res.send(err.toString());
        res.render('pages/admin/suanhaxuatban', { nhaxuatban });
    });
})
.post(urlencodedParser, (req, res) => {
    const { manhaxuatban } = req.params;
    const nxb = new nhaxuatban(req.body.txtTen, manhaxuatban);
    nxb.update(err => {
        if (err) return res.send(err.toString());
        res.redirect('/nhaxuatban');
    });
});

// xoa
app.get('/xoanhaxuatban/:manhaxuatban', (req, res) => {
    const { manhaxuatban } = req.params;
    nhaxuatban.removeById(manhaxuatban, err => {
        if (err) return res.send('error');
        res.redirect("/nhaxuatban");
    });
});

// chude, nhaxuatban    

app.get('/login', (req, res) =>{
    res.render('login');
});

app.get('/register', (req,res) => {
    res.render('register');
});

app.get('/admin', (req,res) => {
    res.render('pages/admin/admin');
});

//facebook


app.listen(process.env.PORT || 3000, () => console.log('Server started!'));