require("dotenv").config();
const path = require("path");
const axios = require("axios");
const PDF = require('pdfkit')
const User = require(path.join(__dirname, "..", "models", "user.model"));
const Duvi = require(path.join(__dirname, "..", "models", "duvi.model"));
const Product = require(path.join( __dirname, "..", "models", "product.model.js"));
const Purchase = require(path.join( __dirname, "..", "models", "purchase.model.js" ));
const PaymentInvoice = require(path.join( __dirname, "..", "models", "paymentInvoice.model.js" ));
const generatePdf = require(path.join( __dirname, "..", 'libs', 'generatePdf.js' ));

const PaymentsController = {};

PaymentsController.getPaymentLink = async (req, res) => {
  try {
    const url = "https://api.mercadopago.com/checkout/preferences";
    const { cart } = req.body;

    const items = cart.map((el) => {
      return {
        id: el._id,
        title: el.name,
        description: el.description,
        quantity: el.quantity,
        unit_price: el.price,
        category_id: el.category,
        picture_url: el.principalImage,
      };
    });

    const body = {
      payer_email: "test_user_49360370@testuser.com",
      payer: {
        id: "test_user_49360370",
        email: "test_user_49360370@testuser.com",
        name: "Test User",
      },
      items,
      back_urls: {
        failure: "/failure",
        pending: "/pending",
        success: "/success",
      },
      auto_return: "approved",
      statement_descriptor: "Duvi", //Descripcion en Resumen de Tarjeta
      notificacion_url: `https://${process.env.ROOT_URL}/api/payments/notifications`,
      additional_info: "COMPRA",
    };

    const payment = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    });

    return res.status(201).send(payment.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

PaymentsController.paymentSuccess = async (req, res) => {
  /* 
    - Notificar al vendedor (websockets)
    - Crear nuevo documento de compra con estado "in process" #
    - Crear nuevo documento "paymentInvoice" con la información a renderizar en el front #
    - Agregar nueva propiedad "paymentInvoice" con el documento nuevo (ref) #
    - Agregar al historial y seguimiento de vendedor y comprador #
    - Agregar monto a wallet vendedor 
    - Generar factura (en html) y guardar su enlace en el documento de la compra #
    - Crear "seguimientos" en el documento del usuario y añadir la compra (ref) # 
    - Mandar por email la confirmación y la factura 
    - Quitar producto del carrito del comprador
    - Quitar cantidad de stock al producto
  */

  try {
    const { idBuyer, idSeller } = req.headers;
    const { cart } = req.body;
    const images = cart.map((el) => el.principalImage);

    const products = cart.map((el) => {
      return {
        name: el.name,
        quantity: el.quantity,
        price: el.price,
        size: sizeSelected,
        idProduct: el._id 
      };
    });

    const newPaymentInvoice = new PaymentInvoice({seller: idSeller, buyer: idBuyer, purchase: products});

    const newPurchase = new Purchase({
      state: "in process",
      buyer: idBuyer,
      seller: idSeller,
      products,
      images,
      PaymentInvoice: newPaymentInvoice._id
    });

    await User.findByIdAndUpdate(idBuyer, { '$addToSet': { 'shoppingHistory': newPurchase._id } }, {new: true});
    await Duvi.findByIdAndUpdate(idBuyer, { '$addToSet': { 'salesHistory': newPurchase._id } }, {new: true});

  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

module.exports = PaymentsController;
