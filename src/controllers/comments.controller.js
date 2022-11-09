const path = require('path');
require('dotenv').config();
const Comment = require(path.join(__dirname, '..', 'models', 'comments.model'));
const Product = require(path.join(__dirname, '..', 'models', 'product.model'));
const Duvi= require(path.join(__dirname, '..', 'models', 'duvi.model'));

const commentsController = {};

commentsController.getComments = async (req, res, next) => {
    try {
        const {id} = req.params;
        const comments = await Comment.find({commentedIn: id}).populate(['author']);
        res.status(200).send(comments);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

commentsController.createProductComment = async (req, res, next) => {
    try {
        const {author, comment, stars, commentedIn} = req.body;

        const newComment = new Comment({
            author,
            comment,
            stars,
            commentedIn
        });

        const addCommentToProduct = await Product.findByIdAndUpdate(commentedIn, { '$addToSet': { 'comments': newComment._id } }, {new: true}).populate('comments');

        await newComment.save();

        res.status(201).send(addCommentToProduct.comments);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = commentsController;