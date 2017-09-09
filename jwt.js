const jwt = require('jsonwebtoken');
const SECRET_KEY = 'dah239efj2hda89e';

function getToken(obj) {
    return new Promise((resolve, reject) => {
        jwt.sign(obj, SECRET_KEY, { expiresIn: 5 }, (err, token) => {
            if (err) return reject(err);
            resolve(token);
        });
    });
}

function getObject(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (err, obj) => {
            if (err) return reject(err);
            resolve(obj);
        });
    });
}

module.exports = { getObject, getToken };
