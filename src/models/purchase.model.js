const { Schema, model } = require("mongoose");

const purchaseSchema = new Schema({
  state: {
    type: String,
    required: true,
  },
  paymentInvoice: {
    ref: "PaymentInvoice",
    type: Schema.Types.ObjectId
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "Duvi",
    required: true,
  },
  images: [String],
  products: Array,
}, {
    timestamps: true,
    timeseries: true
});

module.exports = model("Purchase", purchaseSchema);
