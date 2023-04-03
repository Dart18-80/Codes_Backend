const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Product extends Model {}
Product.init({
    Id_Product:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    Name_Product: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull:{
                msg: "Name Product cannot be empty"
            }
        },
    },
    Deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
    },
},{
    sequelize,
    modelName: "Product"
})

module.exports = Product;