const express = require("express");
const path = require("path");
const router = express.Router();
const duviControllers = require(path.join(__dirname, '..', 'controllers', 'duvi.controller'));
const {checkDuplicateDuvi} = require(path.join(__dirname, '..', 'middlewares', 'verifyMiddleware'));

router.get('/', duviControllers.getDuvi);

router.get('/:id', duviControllers.getDuviById);

router.post('/', [
    checkDuplicateDuvi('name', 'Nombre de tienda ya utilizado, utilice otro.'),
    checkDuplicateDuvi('email', 'Email ya utilizado por otra tienda.'),
    checkDuplicateDuvi('cellPhone', 'No se puede utilizar el mismo celular en 2 tiendas.')
] , duviControllers.createDuvi);

router.put('/update/:id', duviControllers.updateDuvi);

router.put('/profilePic/:id', duviControllers.updateProfilePhoto);

router.put('/bannerPic/:id', duviControllers.updateBannerPhoto);

module.exports = router;