const {
  or
} = require('sequelize');
const signature = require('../models/signature');
const user = require('../models/user')
const documents = require('../models/documents');
const models = require('../models/index');
const controllers = {}
const jwt = require('jsonwebtoken')
const path = require('path')
const {
  Op
} = require("sequelize");

// buat request dokumen yang ingin ditandangani

controllers.myrequest = async (req, res) => {

  try {
    const userId = req.user.id
    const ttd = await models.signature.findAll({include :[
      {model: models.documents,
        attribute: [ 'filename'],
      },
      {
        model: models.user, as:'Receiver',
        attribute: ['username'] 
      }
    ],
      where: {
        user_id: userId
      }
    })
   
  
    res.render('myrequest', {
      
      signature: ttd
    });
  } catch (error) {
    console.log(error)
  }
}

controllers.requestsign = async (req, res) => {

  try {

    const userId = req.user.id
    const userProfile = await user.findOne({
      where: {
        id: userId 
      }
    })
    if (!userProfile) {
      return res.status(401).json({
        message: 'Profil pengguna tidak ditemukan.'
      });
    }

    const ttd = await models.signature.findAll({ include:[
      {model: models.documents, 
        attribute: ['filename'],
      },
      {model: models.user, as: 'Sender',
        attribute: ['username'],
      }
    ],
    where: {
      id_tujuan: userId,
      status: 'waiting'
    }
    });

    res.render('requestsign', {
      user: userProfile,
      signature: ttd
    });
  } catch (error) {
    console.log(error)
  }
}

controllers.requestsend = async (req, res) => {

  try {

    const userId = req.user.id
    const userProfile = await user.findOne({
      where: {
        id: userId
      }
    })
    if (!userProfile) {
      return res.status(404).json({
        message: 'Profil pengguna tidak ditemukan.'
      });
    }
    const doc = await models.documents.findAll({
      where:{
        id_user: userId
      }
    })

    const {
      email,
      jabatan,
      dokumen
    } = req.body
    const tujuan = await models.user.findOne({
      where: {
        email: email,

      }
    })

    await signature.create({
      user_id : userId,
      id_tujuan: tujuan.id,
      document_id: dokumen,
      jabatan: jabatan
    })
    
    res.render('requestsend', {
      user: userProfile,
      dokumen: doc

    });
  } catch (error) {
    console.log(error)
  }
}



module.exports = controllers