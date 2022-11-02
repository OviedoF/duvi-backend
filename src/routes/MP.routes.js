const express = require("express");
const path = require("path");
const router = express.Router();
const MPController = require(path.join(__dirname, '..', 'controllers', 'MP.controller'));

router.get('/', MPController.getPaymentLink);
router.post('/notifications', (req, res) => {
    console.log('notificacion recibida de MP ✌')
    res.status(200).send('ok');
});

module.exports = router;