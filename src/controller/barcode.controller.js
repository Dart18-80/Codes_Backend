const Barcode = require('../database/models/Barcode');
const authToken = require('../services/auth');

let getBarcode = async (req, res) => {
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
            res.status(200).json(Barcode);
            return;
        }
        else if(Barcode.length == 0){
            res.status(404).json({errors:[{message: "There is no barcode"}]});
            return;
        }
        else{
            res.status(400).json({errors:[{message: "An error occurred with respect to the barcode"}]});
            return;
        }
    })
}

let postBarcode = async (req, res) => {
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

    await Barcode.create({
        Barcode: Data.Barcode
    })
    .then((newBarcode) => {
        res.status(200).json(newBarcode);
        return;
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });
}


module.exports = {
    getBarcode,
    postBarcode
}