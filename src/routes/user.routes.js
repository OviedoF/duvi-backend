const express = require("express");
const path = require("path");
const router = express.Router();
const userController = require(path.join(__dirname, '..', 'controllers', 'user.controller'));
const { validatePassword, checkDuplicate } = require(path.join(
    __dirname,
    "..",
    "middlewares",
    "verifySignUp"
  ));

router.get('/:id', userController.getUserById);

router.put('/:id',
[
  validatePassword,
  checkDuplicate(
    "email",
    "El email sigue siendo el mismo, por favor desmarque esa casilla.."
  ),
  checkDuplicate(
    "username",
    "Nombre de usuario ya registrado, regístrese con uno diferente."
  ),
  checkDuplicate(
    "userId",
    "Identificador de usuario ya asignado a una cuenta."
  )
], userController.updateUser)

module.exports = router;