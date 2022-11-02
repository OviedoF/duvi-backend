const path = require('path');
const fs = require('fs-extra');
const Product = require(path.join(__dirname, '..', 'models', 'product.model.js'));
const Category = require(path.join(__dirname, '..', 'models', 'category.model.js'));
const { capitalize } = require(path.join(__dirname, '..', 'libs', 'textHelpers'));
const Duvi = require(path.join(__dirname, '..', 'models', 'duvi.model'));
const deleteImage = require(path.join(__dirname, '..', 'libs', 'dirLibrary')); 
require('dotenv').config();

const productsControllers = {};

productsControllers.getProducts = async (req, res) => {
    try {
        const productsFinded = await Product.find();
        res.status(200).send(productsFinded);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

productsControllers.getProductsByCategory = async(req, res) => {
    try {
        const { category } = req.params;
        const categoryFinded = await Category.find({name: capitalize(category)});

        if(!categoryFinded) return res.status(404).send("Categoría no encontrada");

        const categoryId = categoryFinded;

        const productsFinded = await Product.find({category: categoryId});
        res.status(200).send(productsFinded);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

productsControllers.getProductById = async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id).populate(['category', 'subcategories']);

        // await Product.updateMany({}, {stock: 4});

        if(!product) res.status(404).send("Producto no encontrado");

        res.status(200).send(product);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

productsControllers.createProduct = async (req, res) => {
    try {
        const principalImage = req.files.shift();
        const { filename } = principalImage; // req.files[0] = imágen destacada.
        const galeryImages = [];
        const {duviid} = req.headers;

        if(req.files.length >= 0 ){ 
            req.files.forEach(el => {
                const {filename} = el;
                galeryImages.push(`${process.env.ROOT_URL}/images/${filename}`);
            })
        }

        const newProduct = await new Product({
            ...req.body,
            principalImage: `${process.env.ROOT_URL}/images/${filename}`,
            galeryImages,
            duvi: duviid
        });

        await newProduct.save();

        const oldDuvi = await Duvi.findById(duviid, {products:true});
        const oldProductsDuvi = oldDuvi.products;

        const newProducts = [...oldProductsDuvi, newProduct._id.toString()];

        await Duvi.findByIdAndUpdate(duviid, {
            products: newProducts
        })

        res.status(201).send(newProduct);
    } catch (error) {
        req.files.forEach(el => {
            const {filename} = el;
            const dirname = path.join(__dirname, '..', 'public', 'images', filename);

            deleteImage(dirname);
        })

        console.log(error);
        return res.status(500).send(error);
    }
};

productsControllers.updateProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const productFinded = await Product.findById(id)

        if(!productFinded) return res.status(404).send("Producto no encontrado");

        const productUpdated = await Product.findByIdAndUpdate(id, req.body, {new: true});

        res.status(200).send(productUpdated)
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

productsControllers.updatePrincipalImage = async (req, res) => {
    try {
        const {id} = req.params;
        const productFinded = await Product.findById(id)
        const {filename} = req.files[0];

        if(!productFinded) return res.status(404).send("Producto no encontrado");

        const oldImage = productFinded.principalImage.split('/images/')[1];
        const oldImageRoute = path.join(__dirname, '..', 'public', 'images', oldImage);

        deleteImage(oldImageRoute);

        const updatedProduct = await Product.findByIdAndUpdate(id, {
            principalImage: `${process.env.ROOT_URL}/images/${filename}`
        })

        res.status(200).send("Imágen actualizada correctamente.")

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

productsControllers.removeImage = async (req,res) => {
    try {
        const {id, filename} = req.params;
        const productFinded = await Product.findById(id)

        if(!productFinded) return res.status(404).send("Producto no encontrado");

        const imageRoute = path.join(__dirname, '..', 'public', 'images', filename);

        const newImages = productFinded.galeryImages.filter(el => {
           const filenameElement = el.split('/images/')[1];
           return filenameElement !== filename;
        })

        await Product.findByIdAndUpdate(id, {
            galeryImages: newImages
        });

        deleteImage(imageRoute);

        res.status(200).send("Imágen eliminada correctamente.")
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

productsControllers.pushImage = async (req,res) => {
    try {
        const {id} = req.params;
        const productFinded = await Product.findById(id)
        const {filename} = req.files[0]; 

        if(!productFinded) return res.status(404).send("Producto no encontrado");
        if(productFinded.galeryImages.length > 4) return res.status(400).send("No se pueden ingresar más de 5 imágenes.");

        const newImageUrl = `${process.env.ROOT_URL}/images/${filename}`;
        const newImages = productFinded.galeryImages;

        newImages.push(newImageUrl);

        await Product.findByIdAndUpdate(id, {
            galeryImages: newImages
        });

        res.status(200).send("Imágen agregada correctamente.")
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

productsControllers.deleteProduct = async (req,res) => {
    try {
        const {id} = req.params;
        const productFinded = await Product.findById(id)

        if(!productFinded) return res.status(404).send("No se ha encontrado dicho producto.");

        const primaryImage = productFinded.principalImage.split('/images/')[1];
        const dirPrimaryImage = path.join(__dirname, '..', 'public', 'images', primaryImage);
        deleteImage(dirPrimaryImage);

        const {galeryImages} = productFinded;

        galeryImages.forEach(el => {
            const filename = el.split('/images/')[1];

            const dir = path.join(__dirname, '..', 'public', 'images', filename);
            deleteImage(dir);
        });

        await Product.findByIdAndDelete(id);

        res.status(200).send("Producto eliminado correctamente.");
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

module.exports = productsControllers;