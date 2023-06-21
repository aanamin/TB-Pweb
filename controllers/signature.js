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

controllers.tampilrequestsend = async (req, res) => {

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

    res.render('requestsend', {
      user: userProfile,
      dokumen: doc

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
    const status = 'waiting'
    const tujuan = await models.user.findOne({
      where: {
        email: email,

      }
    })
    if(!tujuan){
      return res.status(404).json({
        message: 'maaf email tidak ditemukan'
      })
    }

    const ttd = await models.signature.create({
      user_id : userId,
      id_tujuan: tujuan.id,
      document_id: dokumen,
      jabatan: jabatan,
      status: status,
    })
    
    
    res.status(200).json({
     msg:'Data Berhasil Ditambahkan',
     ttd: ttd,
     success: true
    });
  } catch (error) {
    res.status(400).json({
      msg:'terdapat Eror'
    })
    console.log(error)
  }
}

controllers.deleteMyrequest = async (req,res) => {
  try {
    const userId = req.user.id

    const hapus = await models.signature.destroy({
      where: {
        user_id: req.body.user_id,
        document_id: req.body.document_id

      }

    })
    res.redirect('/myrequest')
  } catch (error) {
    console.log(error)
  }
}



module.exports = controllers