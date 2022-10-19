const express = require("express");
const path = require("path");
const router = express.Router();
const duviControllers = require(path.join(__dirname, '..', 'controllers', 'duvi.controller'));

router.get('/', duviControllers.getDuvi);

router.get('/:id', duviControllers.getDuviById);

router.post('/', duviControllers.createDuvi);

router.put('/update/:id', duviControllers.updateDuvi);

router.put('/profilePic/:id', duviControllers.updateProfilePhoto);

router.put('/bannerPic/:id', duviControllers.updateBannerPhoto);

module.exports = router;