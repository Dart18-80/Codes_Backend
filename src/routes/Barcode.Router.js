const express = require('express');

const BarcodeController = require('../controller/barcode.controller');


const BarcodeRouter = express.Router();

//Obtener Barcode
BarcodeRouter.get("/",BarcodeController.getBarcode);

//Agregar Barcode
BarcodeRouter.post("/", BarcodeController.postBarcode);


module.exports = BarcodeRouter;