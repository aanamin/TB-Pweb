
const {sequelize, DataTypes, err} = require('sequelize')
const db = require('../config/dbConfig.js')
const signature = require('./signature.js')

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
        allowNull   :true
    },
    sign_img :{
        type        : DataTypes.STRING,
        allowNull   : true
        
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
    freezeTableName : true,
    timestamps  : true,
    createdAt:'created_at',
    updatedAt: 'updated_at'
})

// user.hasMany(signature);
module.exports = user