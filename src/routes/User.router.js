const express = require('express');

const userController = require('../controller/user.controller');


const UserRouter = express.Router();

//Obtener Usuario
UserRouter.get("/",userController.UserProfile);

//Crear un usuario
UserRouter.post("/register", userController.register);

//Login
UserRouter.post("/login", userController.login);

//Modificar un usuario
UserRouter.put("/", userController.EditProfile);

module.exports = UserRouter;
