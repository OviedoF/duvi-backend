const {Schema, model} = require('mongoose');

const duviSchema = new Schema({
    profileImage: {
        type: String,
        required: true
    },
    bannerImage: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    direction: {
        street: String,
        height: Number
    },
    socialMedia: {
        website: String,
        whatsapp: String,
        facebook: String,
        instagram: String,
        youtube: String,
        linkedin: String,
        tiktok: String,
        twitter: String
    },  
    contact: {
        cellPhone: String,
        email: String
    },
    products: [{
        ref: "Product",
        type: Schema.Types.ObjectId
    }]
});

module.exports = model('Duvi', duviSchema);