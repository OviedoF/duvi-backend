const path = require('path');
require('dotenv').config();
const User = require(path.join(__dirname, '..', 'models', 'User.model'));
const Role = require(path.join(__dirname, '..', 'models', 'role.model'));
const Duvi = require(path.join(__dirname, '..', 'models', 'duvi.model'));
const Purchase = require(path.join(__dirname, '..', 'models', 'purchase.model'));
const deleteImage = require(path.join(__dirname, '..', 'libs', 'dirLibrary'));

const duviController = {};

duviController.getDuvi = async (req, res) => {
    try {
        const duvis = await Duvi.find();

        res.status(200).send(duvis);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

duviController.getDuviById = async (req, res) => {
    try {
        const {id} = req.params;
        const duvi = await Duvi.findById(id).populate(['products', 'posts', 'comments']);

        // await Purchase.deleteMany({state: "En proceso"});

        if(!duvi) res.status(404).send("Tienda no encontrada.");

        res.status(200).send(duvi);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

duviController.createDuvi = async (req, res) => {
    try {
        const {user_id} = req.headers;
        console.log(user_id);

        const user = await User.findById(user_id);
        const rolDuvi = await Role.findOne({name: 'duvi'});
        const rolesUser = user.roles;
        const newRoles = [...rolesUser, rolDuvi._id.toString()];

        if(!user) throw "Usuario no encontrado";

        const images = req.files.map(el => {
            const {filename} = el;
            return `${process.env.ROOT_URL}/images/${filename}`;
        })

        const newDuvi = new Duvi({
            ...req.body,
            profileImage: images[0],
            bannerImage: images[1]
        })

        if(!user.roles.includes(rolDuvi._id.toString())) {
            await User.findByIdAndUpdate(user_id, {
                duvi: newDuvi._id,
                roles: newRoles
            });
        }

        await User.findByIdAndUpdate(user_id, {wallet: {
            onProperty: 0,
            onWait: 0
        }});

        await newDuvi.save();

        res.status(201).send(newDuvi);
    } catch (error) {
        req.files.forEach(el => {
            const {filename} = el;
            const dirname = path.join(__dirname, '..', 'public', 'images', filename);

            deleteImage(dirname);
        })

        console.log(error);
        res.status(500).send(error);
    }
};

duviController.updateDuvi = async (req, res) => {
    try {
        const {id} = req.params;
        const duvi = await Duvi.findById(id);

        if(!duvi) res.status(404).send("Tienda no encontrada.");

        const updatedDuvi = await Duvi.findByIdAndUpdate(id, req.body, {new: true});

        res.status(200).send(updatedDuvi);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

duviController.updateProfilePhoto = async (req, res) => {
    try {
        const {id} = req.params;
        const duvi = await Duvi.findById(id);
        const {filename} = req.files[0];

        if(!duvi) res.status(404).send("Tienda no encontrada.");

        const oldImage = duvi.profileImage.split('/images/')[1];
        console.log(oldImage);
        const oldImageRoute = path.join(__dirname, '..', 'public', 'images', oldImage);
        console.log(oldImageRoute);
        deleteImage(oldImageRoute);

        const updatedDuvi = await Duvi.findByIdAndUpdate(id, {
            profileImage: `${process.env.ROOT_URL}/images/${filename}`
        }, {new: true})

        res.status(200).send(updatedDuvi);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

duviController.updateBannerPhoto = async (req, res) => {
    try {
        const {id} = req.params;
        const duvi = await Duvi.findById(id);
        const {filename} = req.files[0];

        if(!duvi) res.status(404).send("Tienda no encontrada.");

        const oldImage = duvi.bannerImage.split('/images/')[1];
        const oldImageRoute = path.join(__dirname, '..', 'public', 'images', oldImage);
        deleteImage(oldImageRoute);

        const updatedDuvi = await Duvi.findByIdAndUpdate(id, {
            bannerImage: `${process.env.ROOT_URL}/images/${filename}`
        }, {new: true});

        res.status(200).send(updatedDuvi);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

duviController.getNotifications = async (req, res) => {
    try {
        const {id} = req.params;
        console.log(id);
        const duvi = await Duvi.findById(id, {notifications: true});
        console.log(duvi);
        return res.status(200).send(duvi.notifications)
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

module.exports = duviController;