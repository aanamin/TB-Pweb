
const { or } = require('sequelize');
const signature = require('../models/signature');
const user = require('../models/user')
const documents = require('../models/documents');
const models = require('../models/index');
const controllers = {}
const jwt = require('jsonwebtoken')
const path = require('path')
const { Op } = require("sequelize");

// buat request dokumen yang ingin ditandangani

controllers.tampilRequestsign = async(req,res)=> {
   
    try {
        
        const userId = req.user.id
        const userProfile = await user.findOne({where: {
            id: userId
        }})
        if (!userProfile) {
          return res.status(404).json({ message: 'Profil pengguna tidak ditemukan.' });
        }
    
        res.render('requestsign', {
            user: userProfile
        });
      } catch (error) {
        console.log(error)
      }
}

controllers.myrequest = async(req,res)=> {
   
    try {
        
        const userId = req.user.id
        const userProfile = await user.findOne({where: {
            id: userId
        }})
        if (!userProfile) {
          return res.status(404).json({ message: 'Profil pengguna tidak ditemukan.' });
        }
    
        res.render('myrequest', {
            user: userProfile
        });
      } catch (error) {
        console.log(error)
      }
}

controllers.requestsend = async(req,res)=> {
   
    try {
        
        const userId = req.user.id
        const userProfile = await user.findOne({where: {
            id: userId
        }})
        if (!userProfile) {
          return res.status(404).json({ message: 'Profil pengguna tidak ditemukan.' });
        }
    
        res.render('requestsend', {
            user: userProfile
        });
      } catch (error) {
        console.log(error)
      }
}

controllers.buatRequest = async(req,res) =>{    
  try {
    const userId = req.user.id;
    


    res.render('upresources')
  } catch (error) {
    
  }
  
 }

 
module.exports = controllers