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
    Success(...args) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), colors.green("[Success]"), ...args);
    }

    _FormatTime() {
        return colors.green(new Date().toLocaleTimeString());
    }
}

module.exports = Logger