
const {sequelize, DataTypes, err} = require('sequelize')
const db = require('../config/dbConfig.js')
const signature = require('./signature.js')

var documents = db.define('documents',{
    id : {
        type        : DataTypes.STRING,
        allowNull   : false,
        primaryKey  : true,
        autoIncrement: false
    },
    id_user : {
        type        : DataTypes.STRING,
        allowNull   : false
    },
    name : {
        type        : DataTypes.STRING,
        allowNull   : false
    },
    filename : {
        type        : DataTypes.STRING,
        allowNull   : false
    },
    description :{
        type        : DataTypes.STRING,
        allowNull   : false
    },
    
    created_at : {
        type        : DataTypes.DATE,
        allowNull   : false
    },
    updated_at : {
        type        : DataTypes.DATE,
        allowNull   : false
    }
}, 
{
    freezeTableName : true,
    timestamps  : true,
    createdAt:'created_at',
    updatedAt: 'updated_at'
})


module.exports = documents