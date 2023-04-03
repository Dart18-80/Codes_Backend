const Barcode = require('../database/models/Barcode');
const Records = require('../database/models/Records');
const User = require('../database/models/User');
const Phase = require('../database/models/Phase');
const Product = require('../database/models/Product');
const authToken = require('../services/auth');
const { Op } = require("sequelize");
const sequelize = require('sequelize');

let getRecords = async (req, res) => {
    if(!req.headers.auth){
        res.status(401).json({errors:[{message: "Unauthorized."}]});
        return;
    }
    const userData = authToken(req.headers.auth);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "Unauthorized."}]});
        return;
    }

    await Records.findAll({
        include:[{
            model: Barcode
        },{
            model: User 
        },{
            model: Phase
        },{
            model: Product 
        }],
        attributes: {
            exclude: ['createdAt','updatedAt', 'UserIdUser', 'ProductIdProduct','PhaseIdPhase','BarcodeIdBarcode']
        }
    })
    .then((Records) => {
        if(Records.length >= 1){
            res.status(200).json(Records);
        }
        else if(Records.length == 0){
            res.status(404).json({errors:[{message: "There is no barcode"}]});
        }
        else{
            res.status(400).json({errors:[{message: "An error occurred with respect to the barcode"}]});
        }
    })
}

let postRecords = async (req, res) => {
    if(!req.headers.auth){
        res.status(401).json({errors:[{message: "Unauthorized."}]});
        return;
    }
    const userData = authToken(req.headers.auth);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "Unauthorized."}]});
        return;
    }

    const InfoRegister = {};

    const Data = req.body;

    InfoRegister.Product = Data.Id_Product;

    await Barcode.findAll({
        where:{
            Barcode: Data.Barcode,
            Status: false,
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((Barcode) => {
        if(Barcode.length == 1){
            InfoRegister.Barcode = Barcode[0];
        }
        else if(Barcode.length == 0){
            res.status(404).json({errors:[{message: "There is no barcode or Barcode already used"}]});
            return;
        }
        else{
            res.status(400).json({errors:[{message: "An error occurred with respect to the barcode"}]});
            return;
        }
    })
    .catch(err =>{
        res.status(400).json(err);
        return;
    });

    if(InfoRegister.Barcode == null){
        return;
    }

    await User.findAll({
        where:{
            Id_User: userData.id,
            Deleted: false,
        }
    })
    .then((user) => {
        if(user.length >= 0){
            InfoRegister.User = user[0];
        }else{
            res.status(400).json({errors:[{message: "User Deleted"}]});
            return;
        }
    })
    .catch(err =>{
        res.status(400).json(err);
        return;
    });

    if(InfoRegister.User == null){
        return;
    }

    const Actualy = Date.now();

    await Phase.findAll({
        where:{
            Start_Date: {
                [Op.lte]: Actualy
            },
            Finish_Date:{
                [Op.gte]: Actualy
            }
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((Phase) => {
        if(Phase.length >= 1){
            InfoRegister.Phase = Phase[0];
        }
        else if(Phase.length == 0){
            res.status(404).json({errors:[{message: "There is no date assigned for the phases"}]});
            return;
        }
        else{
            res.status(400).json({errors:[{message: "An error occurred with respect to the phases"}]});
            return;
        }
    }).catch(err =>{
        res.status(400).json({errors:[{message: err}]});
        return;
    })

    if(InfoRegister.Phase == null){
        return;
    }

    await Barcode.update(
    {
        Status: true
    },
    {
        where:{
            Id_Barcode: InfoRegister.Barcode.Id_Barcode,
        }
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });

    await Records.create({
        UserIdUser: InfoRegister.User.Id_User,
        ProductIdProduct: InfoRegister.Product,
        PhaseIdPhase: InfoRegister.Phase.Id_Phase,
        BarcodeIdBarcode: InfoRegister.Barcode.Id_Barcode,
    })
    .then((newRecord) => {
        res.status(200).json(newRecord);
        return;
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });
}

let getTop = async (req, res) => {

    if(!req.headers.auth){
        res.status(401).json({errors:[{message: "Unauthorized."}]});
        return;
    }
    const userData = authToken(req.headers.auth);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "Unauthorized."}]});
        return;
    }

    let PhaseActual;

    const Actualy = Date.now();

    await Phase.findAll({
        where:{
            Start_Date: {
                [Op.lte]: Actualy
            },
            Finish_Date:{
                [Op.gte]: Actualy
            }
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((Phase) => {
        if(Phase.length >= 1){
            PhaseActual = Phase[0];
        }
        else if(Phase.length == 0){
            res.status(404).json({errors:[{message: "There is no date assigned for the phases"}]});
            return;
        }
        else{
            res.status(400).json({errors:[{message: "An error occurred with respect to the phases"}]});
            return;
        }
    }).catch(err =>{
        res.status(400).json({errors:[{message: err}]});
        return;
    })

    if(PhaseActual == null){
        return;
    }

    await Records.findAll({
        limit: 10 ,
        attributes: {
            include: [[sequelize.fn('COUNT', sequelize.col('Records.UserIdUser')), 'userCount']],
            exclude: ['Id_Records','createdAt','updatedAt','UserIdUser','ProductIdProduct','PhaseIdPhase','BarcodeIdBarcode']
        },
        include:[{
            model: User,
            attributes: {
                exclude: ['Phone','Email','Deleted','Winner','createdAt','updatedAt']
            },
            where: {
                Winner: false,
            }
        }],
        group: "UserIdUser",
        where:{
            PhaseIdPhase: PhaseActual.Id_Phase
        }, 
        order: [
            [sequelize.literal('userCount'), 'DESC']
        ]
    }).then((Top) => {
        if(Top.length >= 1){
            res.status(200).json(Top);
            return;
        }
        else if(Top.length == 0){
            res.status(404).json({errors:[{message: "There are no records for these dates"}]});
            return;
        }
        else{
            res.status(400).json({errors:[{message: "An error occurred with respect to the Records"}]});
            return;
        }
    }).catch(err =>{
        res.status(400).json({errors:[{message: err}]});
        return;
    })
}

let getPoints = async (req, res) => {
    if(!req.headers.auth){
        res.status(401).json({errors:[{message: "Unauthorized."}]});
        return;
    }
    const userData = authToken(req.headers.auth);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "Unauthorized."}]});
        return;
    }

    let PhaseActual;

    const Actualy = Date.now();

    await Phase.findAll({
        where:{
            Start_Date: {
                [Op.lte]: Actualy
            },
            Finish_Date:{
                [Op.gte]: Actualy
            }
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((Phase) => {
        if(Phase.length >= 1){
            PhaseActual = Phase[0];
        }
        else if(Phase.length == 0){
            res.status(404).json({errors:[{message: "There is no date assigned for the phases"}]});
            return;
        }
        else{
            res.status(400).json({errors:[{message: "An error occurred with respect to the phases"}]});
            return;
        }
    }).catch(err =>{
        res.status(400).json({errors:[{message: err}]});
        return;
    })

    if(PhaseActual == null){
        return;
    }

    await Records.findAll({
        attributes: {
            include: [[sequelize.fn('COUNT', sequelize.col('Records.UserIdUser')), 'userCount']],
            exclude: ['Id_Records','createdAt','updatedAt','UserIdUser','ProductIdProduct','PhaseIdPhase','BarcodeIdBarcode']
        },
        group: "UserIdUser",
        where:{
            PhaseIdPhase: PhaseActual.Id_Phase,
            UserIdUser: userData.id,
        }, 
        order: [
            [sequelize.literal('userCount'), 'DESC']
        ]
    }).then((points) => {
        if(points.length >= 1){
            res.status(200).json(points);
            return;
        }
        else if(Phase.length == 0){
            res.status(404).json({errors:[{message: "There is no date assigned for the phases"}]});
            return;
        }
        else{
            res.status(400).json({errors:[{message: "An error occurred with respect to the points"}]});
            return;
        }
    }).catch(err =>{
        res.status(400).json({errors:[{message: err}]});
        return;
    })
}



module.exports = {
    getRecords,
    postRecords,
    getTop,
    getPoints
}