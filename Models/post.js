var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema(
    {
        title: { type: String, defaultValue: null },
        subtitle: {
            type: String,
            defaultValue: null,
        },
        content: String,
        comments: {
            type: Schema.Types.ObjectId,
            ref: "comments",
        },
        category: Schema.Types.Mixed,
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        slug: {
            type: String,
            defaultValue: null,
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
