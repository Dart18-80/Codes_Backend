const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Phase extends Model {}
Phase.init({
    Id_Phase:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    Name_Phase: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull:{
                msg: "Name Phase cannot be empty"
            }
        },
    },
    Start_Date: {
        type: DataTypes.DATE,
        allowNull: false,
        unique: true,
        validate: {
            isDate:{
                args: true,
                msg: "Start_Date it's not in the right format"
            },
        },
    },
    Finish_Date: {
        type: DataTypes.DATE,
        allowNull: false,
        unique: true,
        validate: {
            isDate:{
                args: true,
                msg: "Finish_Date it's not in the right format"
            },
        },
    },
},{
    sequelize,
    modelName: "Phase"
})

module.exports = Phase;