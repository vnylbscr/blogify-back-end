var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    author: [Schema.Types.Mixed],
    ownerId: Schema.Types.ObjectId,
    title: { type: String, defaultValue: null },
    subTitle: String,
    comments: [Schema.Types.Mixed],
    createdAt: new Date(),
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
