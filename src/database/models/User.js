const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class User extends Model {}
User.init({
    Id_User: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Name cannot be empty"
            },
            is: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
            len: {
                args: [3, 20],
                msg: "The name must have at least 3 letters and a maximum of 20 letters"
            },
        },
    },
    Lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Lastname cannot be empty"
            },
            is: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
            len: {
                args: [3, 20],
                msg: "Lastname must have at least 3 letters and a maximum of 20 letters"
            },
        },
    },
    Phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Phone cannot be empty"
            },
            len: {
                args: [3, 20],
                msg: "Lastname must have at least 3 letters and a maximum of 20 letters"
            },
        },
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Email cannot be empty"
            },
            isEmail: {
                args: true,
                msg: "Email it's not in the right format"
            },
        },
    },
    Deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
    },
    Winner: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "User"
})

module.exports = User;