const express = require('express')
const router = express.Router()
const loginController = require('../controllers/loginController.js')

router.post('/', loginController.handleRegisteredUser)

module.exports = router;