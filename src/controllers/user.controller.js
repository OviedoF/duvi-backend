const path = require('path');
require('dotenv').config();
const User = require(path.join(__dirname, '..', 'models', 'user.model'));
const Duvi = require(path.join(__dirname, '..', 'models', 'duvi.model'));
const Role = require(path.join(__dirname, '..', 'models', 'role.model'));
const deleteImage = require(path.join(__dirname, '..', 'libs', 'dirLibrary'));

const userController = {};

userController.getUserById = async (req, res) => {
    try {
        const {id} = req.params;
        const userFinded = await User.findById(id, {
            password: false,
            roles: false
        });
        
        // await User.updateMany({}, { follows: [] });

        if(!userFinded) return res.status(404).send('No se ha podido encontrar el usuario.');

        res.status(200).send(userFinded);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

userController.updateUser = async (req, res) => {
    try {
        const {id} = req.params;
        const userFinded = await User.findById(id);

        if(!userFinded) return res.status(404).send('No se ha podido encontrar el usuario.');

        if(req.files[0]){
            const oldImageName = userFinded.userImage.split('/images/')[1] || userFinded.userImage.split('/image/upload/')[1];
            console.log(oldImageName)
            const routeImagesFolder = path.join(__dirname, '..', 'public', 'images', oldImageName);
            deleteImage(routeImagesFolder);

            const {filename} = req.files[0];
            await User.findByIdAndUpdate(id, { userImage: `${process.env.ROOT_URL}/images/${filename}` });
        }

        const userUpdated = await User.findByIdAndUpdate(id, req.body);
        res.status(200).send(userUpdated);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

userController.updateWishList = async (req, res) => {
    try {
        const {id} = req.params;
        const {productId} = req.body;

        const user = await User.findById(id, {wishList: true});
        console.log(user.wishList.includes(productId));

        if(!user.wishList.includes(productId)) {
            const userWishList = await User.findByIdAndUpdate(id, { '$addToSet': { 'wishList': productId } }, {new: true});
            res.status(200).send(userWishList.wishList);
        }

        if(user.wishList.includes(productId)) {
            const userWishList = await User.findByIdAndUpdate(id, { '$pull': { 'wishList': productId } }, {new: true});
            res.status(200).send(userWishList.wishList);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

userController.updateFollows = async (req, res) => {
    try {
        const {id} = req.params;
        const {duviId} = req.body;

        const user = await User.findById(id, {follows: true});
        console.log(user.follows.includes(duviId));

        if(!user.follows.includes(duviId)) {
            const userFollows = await User.findByIdAndUpdate(id, { '$addToSet': { 'follows': duviId } }, {new: true});
            res.status(200).send(userFollows.follows);
        }

        if(user.follows.includes(duviId)) {
            const userFollows = await User.findByIdAndUpdate(id, { '$pull': { 'follows': duviId } }, {new: true});
            res.status(200).send(userFollows.follows);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

userController.updateShoppingCart = async (req, res) => {
    try{
        const {id} = req.params;
        const {productId} = req.body;

        const user = await User.findById(id, {shoppingCart: true});

        // let shoppingCart = user.shoppingCart;
        // let aux = {};

        // shoppingCart.forEach(el => {
        //     if(!aux[el.product]) aux[el.product] = {
        //         product: el.product,
        //         quantity: 0
        //     };

        //     aux[el.product].quantity++;
        // });

        if(!user.shoppingCart.includes(productId)) {
            const userUpdated = await User.findByIdAndUpdate(id, { '$addToSet': { 'shoppingCart': productId } }, {new: true});
            res.status(200).send(userUpdated.shoppingCart);
        }

        if(user.shoppingCart.includes(productId)) {
            const userUpdated = await User.findByIdAndUpdate(id, { '$pull': { 'shoppingCart': productId } }, {new: true});
            res.status(200).send(userUpdated.shoppingCart);
        }
    } catch(e) {
        console.log(e);
    }
}

userController.getShoppingCart = async (req, res) => {
    try{
        const {id} = req.params;

        if(id !== undefined) {
            const user = await User.findById(id, {shoppingCart: true}).populate(["shoppingCart"]);

            let aux = {};

            for (const product of user.shoppingCart) {
                const duviOfProduct = await Duvi.findById(product.duvi, {name: true, profileImage: true});
                
                if(!aux[duviOfProduct.name]) {
                    aux[duviOfProduct.name] = {
                        duviImage: duviOfProduct.profileImage,
                        quantity: 1,
                        products: []
                    }
                }

                aux[duviOfProduct.name].products.push(product);
            }

            console.log(aux);
            res.status(200).send(aux);
        }
    } catch(e) {
        console.log(e);
    }
}
module.exports = userController;