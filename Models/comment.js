var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    ownerId: Schema.Types.ObjectId,
    content: { type: String, defaultValue: null },
    createdAt: new Date(),
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
