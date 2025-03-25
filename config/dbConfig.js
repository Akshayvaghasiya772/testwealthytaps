const { default: mongoose } = require("mongoose");
const { dbConConst } = require("../constants/dbConst");

const conUri = `${dbConConst.DB_CONNECTION}://${dbConConst.DB_USERNAME}${dbConConst.DB_PASSWORD}${dbConConst.DB_HOST}:${dbConConst.DB_PORT}/${dbConConst.DB_DATABASE}`;
const mongoUri = dbConConst.DB_URI || conUri;
const connnectDb = () => {
    mongoose.connect(mongoUri, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    }).then(() => {
        logger.info('Database Connected')
    }).catch((err) => {
        logger.error('Error - DB connection: ', err)
    });

}

connnectDb();

let dbCon = mongoose.connection;
dbCon.once('open', () => logger.info('Database connection opened'));
dbCon.on("error", (err) => {
    logger.info(`Error while connecting DB: ${err}`)
    setTimeout(function() {
        connnectDb();
    }, 60000);
    
});
dbCon.on('disconnected', () => {
    logger.info('Database Disconnected')
    logger.info('Database Reconnecting...')
    connnectDb();
});

module.exports = { dbCon, mongoUri };