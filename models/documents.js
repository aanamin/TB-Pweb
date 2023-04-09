'use strict'
const {sequelize, DataTypes, err} = require('sequelize')
const db = require('../config/dbConfig.js')

var documents = db.define('documents',{
    id : {
        type        : DataTypes.STRING,
        allowNull   : false,
        primaryKey  : true,
        autoIncrement: false
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
}, {
    freezeTableName : true,
    timestamps  : false
})

module.exports = documents