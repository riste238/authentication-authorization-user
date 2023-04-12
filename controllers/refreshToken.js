const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken =  async (req, res) => {
    const cookies = req.cookies;
   
    // const cookies = req.cookies.jwt;
    console.log('Ova se podatocite vo cookies ',cookies);
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    console.log('Ova e refresh tokenot ', refreshToken);  

    const foundUser = await usersDB.users.find(person => person.refreshToken == refreshToken);
    console.log('Najden korisnik ', foundUser);
    if (!foundUser) return res.status(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken }) });
    console.log('Ova e jwt vo refresh tokenot ', jwt);
}   
module.exports = { handleRefreshToken }