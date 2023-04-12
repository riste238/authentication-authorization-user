const {logEvents} = require('../logEvents.js')

const eventHandler = (error, req,res,next) => {
    logEvents(`${error.name}\t${error.message}`, 'errLog.txt')
    res.status(500).send(error.message)
}

module.exports = eventHandler;