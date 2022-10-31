const path = require('path');
require('dotenv').config();
const User = require(path.join(__dirname, '..', 'models', 'user.model'));
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

module.exports = userController;