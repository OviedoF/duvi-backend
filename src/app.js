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
app.use('/api/user', require(path.join(__dirname, 'routes', 'user.routes.js')))

module.exports = app;