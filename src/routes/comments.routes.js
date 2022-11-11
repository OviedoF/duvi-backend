const express = require("express");
const path = require("path");
const router = express.Router();
const commentsController = require(path.join(__dirname, '..', 'controllers', 'comments.controller'));

router.get('/:id', commentsController.getComments);

router.post('/create/product', commentsController.createProductComment);

router.post('/create/duvi', commentsController.createDuviComment);
module.exports = router;