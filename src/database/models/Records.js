const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Records extends Model {}
Records.init({
    Id_Records:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
},{
    sequelize,
    modelName: "Records"
})

module.exports = Records;