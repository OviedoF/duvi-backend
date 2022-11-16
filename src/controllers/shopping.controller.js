require("dotenv").config();
const path = require("path");
const User = require(path.join(__dirname, "..", "models", "User.model"));
const Duvi = require(path.join(__dirname, "..", "models", "duvi.model"));
const Product = require(path.join( __dirname, "..", "models", "product.model.js"));
const Purchase = require(path.join( __dirname, "..", "models", "purchase.model.js" ));
const PaymentInvoice = require(path.join( __dirname, "..", "models", "paymentInvoice.model.js" ));
const server = require(path.join( __dirname, "..", "index.js"));
const SocketIO = require('socket.io');

const shoppingController = {};

shoppingController.authorizeLocalShopping = async (req, res) => {
    try {
        const {id} = req.params;

        const purchaseActualized = await Purchase.findByIdAndUpdate(id, {
            state: "Confirmada"
        }).populate('seller');

        await User.findByIdAndUpdate(purchaseActualized.buyer, {
            '$addToSet': {
                'notifications': {
                    subject: "Retiro en local confirmado.",
                    message: `El retiro en ${purchaseActualized.seller.name} ha sido confirmado.`,
                    redirect: `/user/${purchaseActualized.buyer}/local-purchase`
                }
            }
        });

        res.status(200).send('Compra confirmada.');
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

shoppingController.endLocalShopping = async(req, res) => {
    try {
        const {purchase} = req.body;

        purchase.products.forEach(async (product) => {
            const dbProduct = await Product.findById(product.idProduct, {stock: true});
            const newStock = dbProduct.stock - product.quantity;
            await Product.findByIdAndUpdate(product.idProduct, {stock: newStock});
        });

        await Purchase.findByIdAndUpdate(purchase._id, { state: 'Completada' });

        res.status(200).send('Compra finalizada :D');
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = shoppingController;