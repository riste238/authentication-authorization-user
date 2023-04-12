const logEvents = require ('./logEvents');

const EventEmitter = require('events');
const { setTimeout } = require('timers');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on('', (msg) => logEvents(msg));
setTimeout(() => {
    myEmitter.emit('log', 'Log event emitted.')
}, 2000);