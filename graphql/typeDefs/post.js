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
const { default: slugify } = require("slugify");

const postTypeDefs = gql`
    type Post {
        _id: ID!
        title: String!
        content: String
        author: Author
        comments: [Comment]
        category: [String]
        createdAt: String
        slug: String
    }
    input PostInput {
        userId: ID!
        title: String!
        content: String!
        cetegory: [String]
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
            // if (!context.isAuth) {
            //     throw new AuthenticationError("Token not found.");
            // }
            const { userId, title, content, category } = args.input;

            if (!title || !content) {
                throw new UserInputError("please fill required fields.");
            }

            const newPost = new Post({
                user: userId,
                title,
                content,
                category,
                slug: slugify(title),
            });

            const res = await newPost.save();

            return {
                ...res._doc,
            };
        },
    },
};

module.exports = {
    postTypeDefs,
    postResolvers,
};
