const express = require('express');

const PhaseController = require('../controller/phase.controller');


const PhaseRouter = express.Router();

//Obtener Phase
PhaseRouter.get("/",PhaseController.getPhase);

//Verificar Si existe una Phase
PhaseRouter.get("/existsPhase",PhaseController.existPhase);

//Agregar Phase
PhaseRouter.post("/", PhaseController.PostPhase);


module.exports = PhaseRouter;