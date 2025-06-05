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
        return colors.green(new Date().toLocaleTimeString( "pt-BR", {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }));
    }
}

module.exports = Logger