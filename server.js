const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const { userResolvers, userTypeDefs } = require("./graphql/typeDefs/user");
const { postTypeDefs, postResolvers } = require("./graphql/typeDefs/post");
const {
    authorTypeDefs,
    authorResolvers,
} = require("./graphql/typeDefs/author");
const {
    commentTypeDefs,
    commentResolvers,
} = require("./graphql/typeDefs/comment");

const { Auth } = require("./middleware/auth");
const PORT = process.env.PORT || 4000;

async function startApolloServer() {
    // Construct a schema, using GraphQL schema language
    const typeDefs = gql`
        type Query {
            hello: String
        }
        type Book {
            id: ID!
            name: String!
        }
    `;

    mongoose
        .connect(process.env.DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        .then(() => console.log("MongoDB Connected."))
        .catch((error) => console.log(error));
    // mongo db bağırma abi
    mongoose.set("useCreateIndex", true);

    // Resolvers
    const resolvers = {
        Query: {
            hello: () => "Hello World!",
        },
    };

    // Type Defs and Resolvers
    const server = new ApolloServer({
        typeDefs: [
            typeDefs,
            userTypeDefs,
            postTypeDefs,
            authorTypeDefs,
            commentTypeDefs,
        ],
        resolvers: [
            resolvers,
            userResolvers,
            postResolvers,
            authorResolvers,
            commentResolvers,
        ],
        context: Auth,
    });

    // Server Start
    await server.start();
    const app = express();

    app.get("/", (req, res) => {
        res.redirect("/graphql");
    });
    // Auth Middleware
    app.use((req, res, next) => {
        // const fullToken = req.headers.authorization;
        // if (!fullToken) {
        //     res.status(400).json({
        //         message: "Token bulunamadı",
        //     });
        // } else {
        //     next();
        // }
        console.log("Header Token", req.headers.authorization);
        next();
    });
    // Apply Middlaware
    server.applyMiddleware({ app });
    await new Promise((resolve) => app.listen({ port: PORT }, resolve));
    console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
    return { server, app };
}

startApolloServer();
