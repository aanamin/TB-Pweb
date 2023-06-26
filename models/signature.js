
const {sequelize, DataTypes, err} = require('sequelize')
const db = require('../config/dbConfig.js');
const documents = require('./documents.js');
const user = require('./user.js')

var signature = db.define('signature',{
    user_id : {
        type        : DataTypes.STRING,
        allowNull   : false,
        primaryKey  : true,
        autoIncrement: false
    },
    document_id : {
        type        : DataTypes.STRING,
        allowNull   : false,
        primaryKey  : true,
        autoIncrement: false
    },
    id_tujuan : {
        type        : DataTypes.STRING,
        allowNull   : false
    },
    jabatan : {
        type        : DataTypes.STRING,
        allowNull   : false
    },
    status :{
        type        : DataTypes.STRING,
        allowNull   : true 
    },
    signed_at : {
        type        : DataTypes.DATEONLY,
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
});


module.exports = signature