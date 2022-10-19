const {Schema, model} = require('mongoose');

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        ref: 'Category',
        type: Schema.Types.ObjectId
    },
    subcategories: [{
        ref: 'SubCategory',
        type: Schema.Types.ObjectId
    }],
    stock: Boolean,
    price: {
        type: Number,
        required: true
    },
    principalImage: {
        type: String,
        required: true
    },
    galeryImages: Array,

}, {
    timestamps: true
});

module.exports = model('Product', productSchema);