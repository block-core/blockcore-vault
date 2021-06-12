const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint, colorize, json, simple } = format;

const options = {
    file: {
        level: 'debug',
        filename: './logs/vault.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        format: combine(
            timestamp({
                format: 'YYYY-MM-DD hh:mm:ss A ZZ'
            }),
            json()
        )
    },
    console: {
        level: 'info',
        handleExceptions: true,
        json: false,
        colorize: true,
        format: combine(
            timestamp(),
            colorize(),
            simple(),
        )
    },
};

export const log = winston.createLogger({
    levels: winston.config.npm.levels,
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false
})
