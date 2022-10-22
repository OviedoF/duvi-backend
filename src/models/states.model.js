const {Schema, model} = require('mongoose');

const postSchema = new Schema({
    author: {
        ref: "Duvi",
        type: Schema.Types.ObjectId
    },
    description: {
        type: String,
        required: true
    },
    images: Array,
    likes: Number,
    dislikes: Number
}, {
    timestamps: true
});

module.exports = model('Post', postSchema);