const { getObject, getToken } = require('./jwt');

function redirectIfLoggedIn(req, res, next) {
    const { token } = req.cookies;
    if(!token) return next();
    getObject(token)
    .then(khachhang => res.redirect('/private'))
    .catch(err => {
        res.clearCookie('token');
        next();
    });
}

const checkToken = async (req, res, next) => {
    const { token } = req.cookies;
    if(!token) return res.redirect('/dangnhap');
    try {
        const khachhang = await getObject(token);
        req.khachhang = khachhang;
        const newToken = await getToken({ hoten: khachhang.hoten, email: khachhang.email });
        res.cookie('token', newToken);
        next();
    } catch(err) {
        res.redirect('/dangnhap');
    } 
}

module.exports = { redirectIfLoggedIn, checkToken };
