const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const createInitialRoles = require(path.join(__dirname, 'libs', 'initialRoles'));
const createInitialAdmin = require(path.join(__dirname, 'libs', 'initialAdmin'));

// initialize
require(path.join(__dirname, 'database.js'));
const app = express();
app.use(cors({
    origin: '*'
}));

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//     res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//     next();
// });

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require(path.join(__dirname, 'config', 'multer.config')));

// configs
createInitialRoles();
createInitialAdmin();

// routes
app.use('/api/auth', require(path.join(__dirname, 'routes', 'auth.routes.js'))); // Login, registro, verificar usuario
app.use('/api/products', require(path.join(__dirname, 'routes', 'product.routes.js')));
app.use('/api/category', require(path.join(__dirname, 'routes', 'category.routes.js')));
app.use('/api/subcategory', require(path.join(__dirname, 'routes', 'subCategory.routes.js')));
app.use('/api/duvi', require(path.join(__dirname, 'routes', 'duvi.routes.js')));
app.use('/api/user', require(path.join(__dirname, 'routes', 'user.routes.js')));
app.use('/api/post', require(path.join(__dirname, 'routes', 'posts.routes.js')));
app.use('/api/change-password', require(path.join(__dirname, 'routes', 'changePassword.routes.js')));
app.use('/api/payments', require(path.join(__dirname, 'routes', 'payments.routes.js')));
app.use('/api/history', require(path.join(__dirname, 'routes', 'history.routes.js')));
app.use('/api/comments', require(path.join(__dirname, 'routes', 'comments.routes.js')));
app.use('/api/shop', require(path.join(__dirname, 'routes', 'shopping.routes.js')));

module.exports = app; 