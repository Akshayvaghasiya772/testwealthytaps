const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
var descriptor = require('express-list-endpoints-descriptor')(express);
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const passport = require("passport");
const lodash = require('lodash');
const respBuilder = require("./services/respBuilder");
const logger = require("./services/logger")
const { catchAsync, verifyPermission } = require('./services/commonService')
const requestLogger = require("./services/apiLogService");
const morganInstance = require('./services/morgan')
const { seedData } = require("./services/seederService");
const cluster = require('cluster');
const os = require('os');
const { scheduleCronJobs } = require("./config/cronConfig");
require("./config/dbConfig")
global.__basedir = __dirname;
global.respBuilder = respBuilder;
global.logger = logger;
global.catchAsync = catchAsync;
global._ = lodash;
global.verifyPermission = verifyPermission;
const corsOptions = {
    origin: ["https://www.whatisoffer.com", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "https://admindev.whatisoffer.com", "https://wioad.whatisoffer.com", "https://publisherdev.whatisoffer.com", "https://publisher.whatisoffer.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Language", "Type", "Range", "Deviceid", "Storeid"],
};
if (cluster.isMaster && process.env.USENODECLUSTER) {
    const numCPUs = os.cpus().length;
    console.log('CPU count: ', numCPUs);
    console.log(`Master process ${process.pid} is running`);

    // Fork a worker for each CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        console.log('Starting a new worker...');
        cluster.fork();
    });
} else {
    app.use(cors(corsOptions));
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: "50mb", extended: true }));
    // app.use(requestLogger)
    app.use(morganInstance)
    app.use('/assets', express.static("assets"))
    const limiter = rateLimit({
        windowMs: 60 * 60 * 1000, // 60 minutes
        max: 1000, // Limit each IP to 1000 requests per `window` (here, per 60 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: 'Too many requests from this IP',
    })
    // Apply the rate limiting middleware to all requests
    // app.use(limiter);
    app.use(passport.initialize());

    app.use(router.get("/ping", catchAsync((req, res) => {
        res.message = "Server is running";
        respBuilder.successResponse({}, res);
    })));

    app.get('/', function (req, res, next) {
        res.redirect(process.env.REDIRECT_URL);
    });

    app.get('/test_video', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    })

    app.use(require("./routes/index"));
    seedData(descriptor.listAllEndpoints(app));
    // var hls = new HLSServer(server, {
    //     // path: '/streams',     // Base URI to output HLS streams
    //     // dir: 'public/videos'  // Directory that input files are stored
    //   })
    // Worker processes handle the requests
    const HOST = process.env.HOST || '::';
    server.listen(process.env.PORT, HOST, (err) => {
        if (err) logger.error(`server not started due to: ${err}!`);
        logger.info(`server started at ${process.env.PORT}!`);
    });
    // scheduleCronJobs();
    
}
