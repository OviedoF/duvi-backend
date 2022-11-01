const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    userImage: String,
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    cellphone: String,
    email: {
        type: String,
        required: true,
        unique: true
    },

    userId: {
        type: Number,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    roles: [{
        ref: 'Role',
        type: Schema.Types.ObjectId
    }],

    duvi: {
        ref: 'Duvi',
        type: Schema.Types.ObjectId
    },
    
    wishList: [{
        ref: "Product",
        type: Schema.Types.ObjectId
    }],

    shoppingCart: [{
        ref: "Product",
        type: Schema.Types.ObjectId
    }],

    follows: [{
        ref: "Duvi",
        type: Schema.Types.ObjectId
    }]
}, {
    timestamps: true
});

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

userSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
}

module.exports = model('User', userSchema);