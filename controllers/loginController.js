require('dotenv').config()

const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data; }
}
const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser())

const handleRegisteredUser = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) return res.status(400).json({ 'message': "Username and password are required!" })
    const findUser = userDB.users.find(person => person.username === username);
    if (!findUser) return res.sendStatus(401) // Unautorized!!!

    const match = await bcrypt.compare(password, findUser.password)
    if (match) {

        const accessToken = jwt.sign(
            { "username": findUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' })

        const refreshToken = jwt.sign(
            { "username": findUser.username },
            process.env.REFRESH_ACCESS_TOKEN,
            { expiresIn: '1d' })

        const otherUser = await userDB.users.filter(person => person.username !== findUser.username)
        const currentUser = { ...findUser, refreshToken }
        userDB.setUsers([...otherUser, currentUser])

        await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(userDB.users))
        // sameSite: 'None', secure:true, 
        await res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })


        res.json({ accessToken })
    }
    else { res.sendStatus(401) }
}
module.exports = { handleRegisteredUser };