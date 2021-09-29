const {
    gql,
    AuthenticationError,
    UserInputError,
} = require("apollo-server-express");
const path = require("path");
const Post = require("../../Models/post");
const { default: slugify } = require("slugify");
const { TOKEN_NOT_FOUND } = require("../../lib/constants");

const postTypeDefs = gql`
    type Post {
        _id: ID!
        title: String!
        content: String
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
        getPost(_id: ID!): Post!
        getAllPosts: [Post!]
    }
    extend type Mutation {
        addPost(input: PostInput): Post!
    }
`;

const postResolvers = {
    Query: {
        getAllPosts: async (_, __, context, info) => {
            // if (!context.isAuth) {
            //     throw new AuthenticationError(TOKEN_NOT_FOUND);
            // }
            const posts = await Post.find();
            return posts;
        },
        getPost: async (parent, args, context, info) => {
            if (context.isAuth) {
                throw new AuthenticationError(TOKEN_NOT_FOUND);
            }

            const { _id } = args;

            const foundPost = await Post.findOne({
                _id,
            });

            if (!foundPost) {
                throw new Error("Post not found.");
            }

            return {
                ...foundPost._doc,
            };
        },
    },
    Mutation: {
        addPost: async (parent, args, context, info) => {
            console.log(context);
            if (!context.isAuth) {
                throw new AuthenticationError(TOKEN_NOT_FOUND);
            }
            const { userId, title, subtitle, photo, content, category } =
                args.input;

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
