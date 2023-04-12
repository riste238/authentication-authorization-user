const express = require('express')
const router = express.Router()
const path = require('path')

 router.route('/user')
 .get(function(req, res, next) {
    // res.send('hello user');
     next()
    }, (req,res,next) => {
     res.sendFile(path.join(__dirname, '..','igri', 'igri.html'))
next()
 })

 module.exports = router;