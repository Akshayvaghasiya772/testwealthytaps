let dbPort;
if (process.env.DB_PORT == "") {
    dbPort = process.env.DB_PORT;
} else if (process.env.DB_PORT) {
    dbPort = `${process.env.DB_PORT}`;
} else {
    dbPort = "27017";
}

module.exports = {
    dbConConst : {
        DB_CONNECTION:process.env.DB_CONNECTION || "mongodb",
        DB_HOST:process.env.DB_HOST || "localhost",
        DB_PORT: dbPort,
        DB_DATABASE: process.env.DB_DATABASE || "",
        DB_USERNAME: process.env.DB_USERNAME ? `${process.env.DB_USERNAME}:` : "",
        DB_PASSWORD: process.env.DB_PASSWORD ? `${process.env.DB_PASSWORD}@` : "",
        DB_URI: process.env.DB_URI || null
    },
    API_URL : process.env.API_URL,
}