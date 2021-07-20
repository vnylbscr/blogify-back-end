var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        defaultValue: null,
        unique: true,
    },
    posts: [Schema.Types.Mixed],
    password: { type: String, required: true },
    createdAt: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
