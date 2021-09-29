const {
    gql,
    AuthenticationError,
    UserInputError,
} = require("apollo-server-express");
const path = require("path");
const Post = require("../../Models/post");
const { default: slugify } = require("slugify");
const { TOKEN_NOT_FOUND } = require("../../lib/constants");
const cloudinary = require("cloudinary");
const { v4: uuidv4, v4 } = require("uuid");

const postTypeDefs = gql`
    type Post {
        _id: ID!
        title: String!
        content: String
        image: String
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
        image: String
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

            return foundPost;
        },
    },
    Mutation: {
        addPost: async (parent, args, context, info) => {
            console.log("argsss", args);
            // if (!context.isAuth) {
            //     throw new AuthenticationError(TOKEN_NOT_FOUND);
            // }
            const { userId, title, subtitle, image, content, category } =
                args.input;

            if (!title || !content || !image) {
                throw new UserInputError("please fill required fields.");
            }

            console.log("cloud name", process.env.CLOUD_NAME);
            console.log("cloud name", process.env.CLOUD_API_SECRET_KEY);
            console.log("cloud name", process.env.CLOUD_API_KEY);

            cloudinary.config({
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.CLOUD_API_KEY,
                api_secret: process.env.CLOUD_API_SECRET_KEY,
            });

            const imageRes = await cloudinary.v2.uploader.upload(image, {
                //here i chose to allow only jpg and png upload
                allowed_formats: ["jpg", "png", "jpeg"],
                //generates a new id for each uploaded image
                public_id: v4(),
                /*creates a folder called "your_folder_name" where images will be stored.
                 */
                folder: "blogidy_media",
            });

            console.log("İMAGE URL", imageRes.url);

            const newPost = new Post({
                user: userId,
                title,
                content,
                category,
                image: imageRes.url,
                slug: slugify(title),
            });

            const post = await newPost.save();

            return post;
        },
    },
};

module.exports = {
    postTypeDefs,
    postResolvers,
};
