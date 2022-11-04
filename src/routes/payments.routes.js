const express = require("express");
const path = require("path");
const router = express.Router();
const PaymentsController = require(path.join(__dirname, '..', 'controllers', 'payments.controller'));

router.post('/', PaymentsController.getPaymentLink);

router.post('/success', PaymentsController.paymentSuccess);

router.post('/notifications', (req, res) => {
    console.log('notificacion recibida de MP ✌')
    res.status(200).send('ok');
});

module.exports = router;