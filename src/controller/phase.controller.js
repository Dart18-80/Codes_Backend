const Phase = require('../database/models/Phase');
const authToken = require('../services/auth');
const { Op } = require("sequelize");

let getPhase = async (req, res) => {
    if(!req.headers.auth){
        res.status(401).json({errors:[{message: "Unauthorized."}]});
        return;
    }
    const userData = authToken(req.headers.auth);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "Unauthorized."}]});
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
            res.status(200).json(Phase);
            return;
        }
        else if(Phase.length == 0){
            res.status(404).json({errors:[{message: "There is no date assigned for the phases"}]});
            return;
        }
        else{
            res.status(400).json({errors:[{message: "An error occurred with respect to the phases"}]});
            return;
        }
    })
    

}

let existPhase = async (req, res) => {
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
            res.status(200).json({exists: true});
            return;
        }
        else if(Phase.length == 0){
            res.status(404).json({exists: false});
            return;
        }
        else{
            res.status(400).json({errors:[{message: "An error occurred with respect to the phases"}]});
            return;
        }
    })
}

let PostPhase = async (req, res) => {
    if(!req.headers.auth){
        res.status(401).json({errors:[{message: "Unauthorized."}]});
        return;
    }
    const userData = authToken(req.headers.auth);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "Unauthorized."}]});
        return;
    }

    const Data = req.body;
    const InitDate = new Date(Data.Start_Date);
    const StopDate = new Date(Data.Finish_Date);

    await Phase.create({
        Name_Phase: Data.Name_Phase,
        Start_Date: InitDate,
        Finish_Date: StopDate,
    })
    .then((newPhase) => {
        res.status(200).json(newPhase);
        return;
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });
}


module.exports = {
    getPhase,
    PostPhase,
    existPhase
}