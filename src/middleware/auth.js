const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"] || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : false);

    if (!token || token == null) return res.status(403).send('A token is required for authentication');

    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) throw err;
        return data;
    });
    req.user = decoded;

    return next();
}

module.exports = auth;