require('dotenv').config()
const express = require('express')
const path = require('path')
const fs = require('fs')
const fsPromises = fs.promises;
const corsOptions = require('./dbConfig/corsOptions.js')
const cors = require('cors')
// const logEvents = require('./logEvents.js');
const { logger } = require('./logEvents.js');
const cookieParser = require('cookie-parser')
const eventHandler = require('./middleware/eventHandler.js');
const verifyJWT = require('./middleware/verifyJWT')
const PORT = process.env.PORT || 3500;

const app = express()
app.use(logger)

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')));
app.use('/subdir', require('./routes/subdir'))
app.use('/register', require('./routes/register.js'));
app.use('/login', require('./routes/login.js'))
app.use('/restart', require('./routes/refresh.js'))
// app.use('/logout', require('./routes/logout.js'))

app.use(verifyJWT)

app.use('/employees', require('./routes/api/employees.js'))

app.use('/igri', require('./routes/subdir2.js'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './views/index.html'))
    res.sendFile('./views/index.html', { root: __dirname })
})

app.get('/index', (req, res) => {
    res.redirect('/main.html')
})

app.get('hello(.html)?', (req, res, next) => {
    console.log('Attempt to load hello.html');
    next()
}, (req, res) => {
    res.send('Hello world')
})

app.use(eventHandler)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
})

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
})

app.listen(PORT, function (err) {
    if (err)
        console.log(err);
    console.log('Listening to port');

})