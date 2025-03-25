const bcryptConst = {
    saltRound: 10
}

const JWT_CONST = {
    SECRET: process.env.JWT_SECRET || "D8eor&6fnv4G7d&yhH76V",
    LOGIN_EXP_TIME: "30d",      // 30 days,
    AUTH_EXT_TIME: 1440         //1d X 24h X 60m
}

module.exports = {
    bcryptConst,
    JWT_CONST
}