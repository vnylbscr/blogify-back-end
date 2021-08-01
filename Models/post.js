var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    ownerId: Schema.Types.ObjectId,
    title: { type: String, defaultValue: null },
    subtitle: String,
    content: String,
    comments: [Schema.Types.Mixed],
    media: String,
    category: Schema.Types.Mixed,
    createdAt: String,
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
