const express = require('express');

const ProductController = require('../controller/product.controller');


const ProductRouter = express.Router();

//Obtener Productos
ProductRouter.get("/",ProductController.getProducts);

//Agregar Producto
ProductRouter.post("/", ProductController.CreateProduct);


module.exports = ProductRouter;