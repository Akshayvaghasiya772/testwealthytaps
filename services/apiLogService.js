const expressWinston = require("express-winston");
const { transports } = require("winston");
const moment = require('moment-timezone');
const {dbCon, mongoUri} = require("../config/dbConfig");
require('winston-mongodb')

const requestLogger = expressWinston.logger({
    transports: [
        new transports.MongoDB({
            db: mongoUri,
            collection: 'APILogs',
            metaKey: 'meta',
            options: {
                poolSize: 5,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        }),
    ],
    meta: true,
    msg() {
        return `${moment().format(
            'YYYY-MM-DD HH:mm:ss',
        )} - Request: HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms : ipAddress {{req.connection.remoteAddress}}`;
    },
    requestWhitelist: [
        'url',
        'method',
        'httpVersion',
        'originalUrl',
        'query',
        'body',
        'headers',
    ],
    responseWhitelist: ['statusCode', 'body'],
    dynamicMeta: () => {
        const meta = {};
        meta.server = process.env.SERVER;
        meta.logType = 'request';
        return meta;
    },
})
module.exports = requestLogger;                                   