const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)
    // console.log(authHeader); // Bearer token
    console.log('Ova e authHeader ', authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        // process.env.ACCESS_TOKEN_SECRET,
        process.env.REFRESH_ACCESS_TOKEN,
        (err, decoded) => {
            if (err) return res.status(403) // invalid token
            req.username = decoded.username;
            next()
        }
    )
}
module.exports = verifyJWT