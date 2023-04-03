const express = require('express');

const RegisterController = require('../controller/register.controller');


const RegisterRouter = express.Router();

//Obtener Registros
RegisterRouter.get("/",RegisterController.getRecords);

//Agregar Registro
RegisterRouter.post("/", RegisterController.postRecords);

//Regresa el top 10
RegisterRouter.get("/top", RegisterController.getTop);

//Cantidad de registros hechos en una phase
RegisterRouter.get("/points", RegisterController.getPoints);


module.exports = RegisterRouter;