const Product = require('../database/models/Product')
const authToken = require('../services/auth')

let getProducts = async (req, res) => {
    if(!req.headers.auth){
        res.status(401).json({errors:[{message: "Unauthorized."}]});
        return;
    }
    const userData = authToken(req.headers.auth);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "Unauthorized."}]});
        return;
    }

    await Product.findAll({
        where:{
            Deleted: false,
        },
        attributes: {
            exclude: ['Deleted','createdAt','updatedAt']
        }
    })
    .then((Product) => {
        if(Product.length >= 1){
            res.status(200).json(Product);
            return;
        }
        else if(user.length == 0){
            res.status(404).json({errors:[{message: "There are no products"}]});
            return;
        }
        else{
            res.status(400).json({errors:[{message: "An error occurred with respect to the products"}]});
            return;
        }
    })
    .catch(err =>{
        res.status(400).json(err);
        return;
    });
}

let CreateProduct = async (req, res) => {
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

    await Product.create({
        Name_Product: Data.Name_Product,
    })
    .then((newProduct) => {
        res.status(200).json(newProduct);
        return;
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });
}



module.exports = {
    getProducts,
    CreateProduct
}