const fs = require('fs');
const path = require('path');

class FileLogger {
    constructor(logFilePath = 'logs/app.log', jsonLogPath = 'logs/app.json') {
        this.logFilePath = logFilePath;
        this.jsonLogPath = jsonLogPath;

        // Garante que diretórios existam
        const logDir = path.dirname(logFilePath);
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

        const jsonDir = path.dirname(jsonLogPath);
        if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });

        // Cria os streams
        this.logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
        this.jsonStream = fs.createWriteStream(jsonLogPath, { flags: 'a' });
    }

    write(level, message) {
        const timestamp = this._getTimeText();
        const iso = new Date().toISOString();

        const plain = `(${timestamp}) [${level}] ${message}`;
        this.logStream.write(plain + '\n');

        const json = {
            timestamp: iso,
            level,
            message
        };
        this.jsonStream.write(JSON.stringify(json) + '\n');
    }

    log(...args) {
        this.write('Log', args.join(' '));
    }

    info(...args) {
        this.write('Info', args.join(' '));
    }

    error(...args) {
        this.write('Error', args.join(' '));
    }

    system(...args) {
        this.write('System', args.join(' '));
    }

    success(...args) {
        this.write('Success', args.join(' '));
    }
    debug(...args) {
        this.write('Debug', args.join(' '));
    }
    warning(...args) {
        this.write('Warning', args.join(' '));
    }
    verbose(...args) {
        this.write('Verbose', args.join(' '));
    }
    trace(...args) {
        this.write('Trace', args.join(' '));
    }

    _getTimeText() {
        const now = new Date();
        return now.toLocaleTimeString("pt-BR", {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

module.exports = FileLogger;
