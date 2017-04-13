const colors = require('colors');
const beeper = require('beeper');
let text = process.argv[2];

if (!text) {
    text = 'GeekBrains';
}

console.log(text.rainbow);
beeper('****-*-*');