const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const { SO_SECRET_KEY } = require("../utils/config");

const Auth = (request) => {
    console.log("header", request.header);
    const header = request.req.headers.authorization;
    if (!header) {
        return {
            isAuth: false,
        };
    }
    const token = header.split(" ")[1];
    if (!token) {
        return {
            isAuth: false,
        };
    } else {
        try {
            const user = jwt.verify(token, SO_SECRET_KEY);
            console.log("agaa", user);
            return {
                user,
                isAuth: true,
            };
        } catch (error) {
            return {
                isAuth: false,
            };
        }
    }
};
module.exports = {
    Auth,
};
