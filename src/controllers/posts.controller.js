const path = require('path');
require('dotenv').config();
const Post = require(path.join(__dirname, '..', 'models', 'posts.model'));
const Duvi = require(path.join(__dirname, '..', 'models', 'duvi.model'));
const deleteImage = require(path.join(__dirname, '..', 'libs', 'dirLibrary'));

const postsController = {};

postsController.createPost = async (req, res) => {
    try {
        const {id} = req.params;
        const {content} = req.body;
        const imagesArray = [];

        if(req.files.length > 0) {
            req.files.forEach(el => {
                const {filename} = el;
                imagesArray.push(`${process.env.ROOT_URL}/images/${filename}`);
            })
        }

        const newPost = new Post({
            author: id,
            content,
            images: imagesArray,
            likes: [],
            dislikes: []
        })
        console.log(newPost);

        const duviAuthor = await Duvi.findByIdAndUpdate(id, { '$addToSet': { 'posts': newPost._id.toString() } }, {new: true});
        console.log(duviAuthor);

        await newPost.save();

        res.status(201).send(duviAuthor);
    } catch (error) {
        if(req.files.length > 0){
            req.files.forEach(el => {
                const {filename} = el;
                const dirname = path.join(__dirname, '..', 'public', 'images', filename);
    
                deleteImage(dirname);
            })
        }

        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = postsController;