const colors = require('ansi-colors');

class Logger {

    constructor() {

    }

    Log(...args) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), ...args);
    }
    Error(...args) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), colors.red("[Error]"), ...args);
    }
    Info(...args) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), colors.blueBright("[Info]"), ...args);
    }
    System(...args) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), colors.yellow("[System]"), ...args);
    }

    _FormatTime() {
        return colors.green(new Date().getTime());
    }
}

module.exports = Logger