const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    if (req.headers.authorization) {
        let token = req.headers.authorization.toString().split(" ")[1];
        jwt.verify(token.toString(), 'bookstore', async function (err, decoded) {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    res.json("Token expired!")
                } else {
                    res.json("Invalid token!")
                }
            } else {
                req.body['role'] = decoded.role;
            }
        })
        next();
    }
}

module.exports = {verifyToken};