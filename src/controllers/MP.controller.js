const mercadopago = require('mercadopago');
require('dotenv').config();
const path = require('path');
const {v4} = require('uuid');
const axios = require('axios');

const MPController = {};

MPController.getPaymentLink = async(req, res) => {
    try {
        const url = "https://api.mercadopago.com/checkout/preferences";

        const body = {
            payer_email: "test_user_49360370@testuser.com",
            items: [
                {
                    id: v4(),
                    title: "Random Item",
                    description: "Dummy description",
                    picture_url: "https://ovdev-portfolio.vercel.app/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fsyphhy%2Fimage%2Fupload%2Fv1659386084%2Fryckxo6boijavvv8dpvg.png&w=1920&q=75",
                    category_id: "category123",
                    unit_price: 10,
                    quantity: 1
                }
            ],
            back_urls: {
                failure: '/failure',
                pending: '/pending',
                success: '/success'
            },
            auto_return: "approved",
            statement_descriptor: "Gcompra", //Descripcion en Resumen de Tarjeta
            notificacion_url: `https://${process.env.ROOT_URL}/api/payments/notifications`,
            additional_info: "COMPRA"
        }

        const payment = await axios.post(url, body, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
            }
        });

        return res.status(201).send(payment.data);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

module.exports = MPController;