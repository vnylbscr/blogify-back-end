const { gql, UserInputError } = require("apollo-server-express");
const { validateRegisterInputs } = require("../../utils/validateUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../Models/user");
const userTypeDefs = gql`
    type User {
        id: ID!
        name: String
        email: String
        posts: [Post]
        type: Int
        createdAt: String
        token: String
    }
    input RegisterInput {
        username: String!
        email: String!
        password: String!
    }
    input LoginInput {
        email: String!
        password: String!
    }
    # Get User With ID
    extend type Query {
        getUser(userID: ID!): User!
    }
    # Mutations For User Auth
    type Mutation {
        register(input: RegisterInput): User!
        login(input: LoginInput): User!
    }
`;

const userResolvers = {
    Mutation: {
        // REGISTER USER
        register: async (parent, args, context, info) => {
            console.log(args);
            const { username, email, password } = args.input;

            console.log(username);
            // Validate the user
            const { errors, isValid } = validateRegisterInputs(
                username,
                email,
                password
            );

            if (!isValid) {
                throw new UserInputError("Errors", { errors });
            }
            // todo check user is exist
            const user = await User.findOne({ email });
            console.log("user", user);
            if (user) {
                throw new UserInputError(
                    "Bu e-mail ile kayıtlı bir kullanıcı zaten var.",
                    {
                        errors: {
                            email: "Bu isimde bir e-mail var",
                        },
                    }
                );
            } else {
                // hash password and save user to db
                const hashPassword = await bcrypt.hash(password, 10);
                const newUser = new User({
                    username,
                    email,
                    password: hashPassword,
                    createdAt: new Date(),
                });
                const res = await newUser.save();
                const authToken = jwt.sign(
                    {
                        id: res._id,
                        email: res.email,
                        username: res.username,
                    },
                    "Secret Key",
                    { expiresIn: "4d" }
                );
                return {
                    name: res.username,
                    id: res._id,
                    token: authToken,
                    ...res._doc,
                };
            }
        },
        // LOGIN USER
        login: async (parent, args, context, info) => {
            const { email, password } = args.input;
            const user = await User.findOne({ email });
            if (!user) {
                throw new UserInputError(
                    "Böyle bir kullanıcı bulunamadı. Lütfen bilgileri kontrol edin."
                );
            } else {
                const isValidPassword = await bcrypt.compare(
                    password,
                    user.password
                );

                if (isValidPassword) {
                    const authToken = jwt.sign(
                        {
                            id: user._id,
                            email: user.email,
                            username: user.username,
                        },
                        "Secret Key",
                        { expiresIn: "4d" }
                    );
                    return {
                        ...user._doc,
                        id: user._id,
                        token: authToken,
                    };
                }
            }
        },
    },
};

module.exports = {
    userTypeDefs,
    userResolvers,
};
