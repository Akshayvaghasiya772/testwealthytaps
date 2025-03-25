
const morgan = require('morgan');
const logger = require('./logger');


const morganInstance = morgan('dev', {
    stream: {
        write: (str) => {
            logger.info(str);
        },
    },
});


module.exports = morganInstance;
