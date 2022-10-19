const express = require("express");
const path = require("path");
const router = express.Router();
const categoriesControllers = require(path.join(__dirname, '..', 'controllers', 'categories.controller'));

router.get('/', categoriesControllers.getCategories);

router.get('/:id', categoriesControllers.getCategoryById);

router.post('/createCategory', categoriesControllers.createCategory);

router.put('/update/:id', categoriesControllers.updateCategory);

router.delete('/delete/:id', categoriesControllers.deleteCategory);

module.exports = router;