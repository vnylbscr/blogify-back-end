const userTypeDefs = require("./typeDefs");
const userResolvers = require("./resolver");

const userSchema = {
    userTypeDefs,
    userResolvers,
};

module.exports = userSchema;
