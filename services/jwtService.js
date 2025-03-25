const jwt = require('jsonwebtoken');
const { JWT_CONST } = require('../constants/authConst');

const signJwtToken = ({ email, expireIn }) => {
    return jwt.sign({ email }, JWT_CONST.SECRET, { expiresIn: typeof expireIn == 'number' ? expireIn * 60 : expireIn });

}

const verifyJwtToken = (token) => {
    return jwt.verify(token, JWT_CONST.SECRET)
}

module.exports = {
    signJwtToken,
    verifyJwtToken
}