const {
    gql,
    AuthenticationError,
    UserInputError,
} = require("apollo-server-express");
const path = require("path");
const Post = require("../../Models/post");
const { loadSchemaSync } = require("@graphql-tools/load");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");
const { readFileSync } = require("fs");

// // const postTypeDefs = loadSchemaSync(path.join(__dirname, "./post.graphql"), {
// //     loaders: [new GraphQLFileLoader()],
// // });

// const postTypeDefs = readFileSync(path.join(__dirname, "./post.graphql"), {
//     encoding: "utf-8",
// });

const postTypeDefs = gql`
    type Post {
        id: ID!
        title: String!
        subtitle: String
        content: String!
        media: [String]
        author: Author!
        comments: [Comment!]
        category: [String]!
        createdAt: String
    }
    input PostInput {
        ownerId: ID!
        title: String!
        subtitle: String
        content: String!
        media: String!
        cetegory: [String]
        createdAt: String!
    }
    extend type Query {
        getPost(id: ID!): Post!
        getAllPosts: [Post!]
    }
    extend type Mutation {
        addPost(input: PostInput): Post!
    }
`;

const postResolvers = {
    Query: {
        getAllPosts: async (_, __, context, info) => {
            if (!context.isAuth) {
                throw new AuthenticationError("Token bulunamadı");
            }
            const posts = await Post.find();
            return posts;
        },
    },
    Mutation: {
        addPost: async (parent, args, context, info) => {
            console.log(context);
            if (!context.isAuth) {
                throw new AuthenticationError("Token bulunamadı");
            }
            const {
                ownerId,
                title,
                subtitle,
                content,
                comments,
                media,
                category,
                createdAt,
            } = args.input;

            if (!ownerId || !title || !content) {
                throw new UserInputError("Gerekli alanları lütfen doldurunuz.");
            }

            const newPost = new Post({
                ownerId,
                title,
                subtitle,
                content,
                comments,
                media,
                category,
                createdAt,
            });
            const res = await newPost.save();
            return {
                ...res._doc,
                id: res.doc._id,
            };
        },
    },
};

module.exports = {
    postTypeDefs,
    postResolvers,
};
