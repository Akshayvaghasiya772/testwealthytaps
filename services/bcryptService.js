const bcrypt = require("bcrypt");
const { bcryptConst } = require("../constants/authConst");
const saltRounds = bcryptConst.saltRound;

const createBHash = async (password) => {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    logger.error("Error - create hash", error.message);
    throw new Error("Error - create hash", error);
  }
};

const generateUserId = async () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const firstPart = Array.from({ length: 3 }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length))
  ).join("");
  const secondPart = Array.from({ length: 3 }, () =>
    numbers.charAt(Math.floor(Math.random() * numbers.length))
  ).join("");
  return firstPart + secondPart;
};

const compareBHash = async ({ password, hash }) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error("Error - compare hash", error);
    return false;
  }
};

module.exports = {
  createBHash,
  compareBHash,
  generateUserId,
};
