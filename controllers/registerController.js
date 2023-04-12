const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data; }
}
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    //  console.log(req.headers.authorization);
    const { username, password } = req.body;
    if (!username || !password) { res.status(400).json({ message: 'Username & password are required!' }) }

    // check if exist duplicate usernames in db
    const duplicate = userDB.users.find(user => user.username === username);
    if (duplicate) { return res.status(409) } // conflict

    try {
        const handlePassword = await bcrypt.hash(password, 10);
        // store to the new user;
        const newUser = { "username": username, "password": handlePassword }
        userDB.setUsers([...userDB.users, newUser]);

        await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.users))
        // console.log(userDB.users);
        res.status(201).json({ "success": `New user ${newUser.username}` });
    }
    catch (err) { res.status(500).json({ 'message': err.message }) }
}
module.exports = { handleNewUser };