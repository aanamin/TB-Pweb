'use strict'
const {sequelize, DataTypes, err} = require('sequelize')
const db = require('../config/dbConfig.js')

var user = db.define('user',{
    id : {
        type        : DataTypes.STRING,
        allowNull   : false,
        primaryKey  : true,
        autoIncrement: false
    },
    username : {
        type        : DataTypes.STRING,
        allowNull   : false
    },
    email : {
        type        : DataTypes.STRING,
        allowNull   : false
    },
    password :{
        type        : DataTypes.STRING,
        allowNull   : false
    },
    active :{
        type        :DataTypes.INTEGER,
        allowNull   :false
    },
    sign_img :{
        type        : DataTypes.STRING,
        allowNull   : false
        
    },
    created_at : {
        type        : DataTypes.DATEONLY,
        allowNull   : false
    },
    updated_at : {
        type        : DataTypes.DATEONLY,
        allowNull   : false
    }
}, {
    freezeTableName : true
})

module.exports = user