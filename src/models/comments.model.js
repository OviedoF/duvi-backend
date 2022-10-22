const {Schema, model} = require('mongoose');

const commentSchema = new Schema({
    author: {
        ref: "User",
        type: Schema.Types.ObjectId
    },
    comment: {
        type: String,
        required: true
    },
    images: Array
}, {
    timestamps: true
});

module.exports = model('Comment', commentSchema);