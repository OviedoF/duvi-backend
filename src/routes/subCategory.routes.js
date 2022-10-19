const express = require("express");
const path = require("path");
const router = express.Router();
const subCategoriesControllers = require(path.join(__dirname, '..', 'controllers', 'subcategories.controller'));

router.get('/get', subCategoriesControllers.getSubcategories);
router.get('/get/:id', subCategoriesControllers.getSubcategoryById);
router.get('/get/category/:category', subCategoriesControllers.getSubcategoryByFather);

router.post('/create', subCategoriesControllers.createSubCategory);

router.put('/update/:id', subCategoriesControllers.updateSubCategory);

router.delete('/:id', subCategoriesControllers.deleteSubCategory);

module.exports = router;