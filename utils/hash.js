const bryct = require("bcrypt");

module.exports.hashPassword = async (password) => {
    return await bryct.hash(password, 10);
};
module.exports.comparePassword = async (password, hash) => {
    return await bryct.compare(password, hash);
};
