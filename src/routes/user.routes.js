const express = require("express");
const path = require("path");
const router = express.Router();
const userController = require(path.join(__dirname, '..', 'controllers', 'user.controller'));

router.get('/:id', userController.getUserById);

module.exports = router;