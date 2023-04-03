const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Barcode extends Model {}
Barcode.init({
    Id_Barcode:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    Barcode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull:{
                msg: "Barcode cannot be empty"
            },
            isAlphanumeric:{
                msg: "Barcode is spelled incorrectly"
            },
        },
    },
    Status:{
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
    },
    Winner: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
    },
},{
    sequelize,
    modelName: "Barcode"
})

module.exports = Barcode;