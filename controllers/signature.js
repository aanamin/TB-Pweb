
const { or } = require('sequelize');
const signature = require('../models/signature');
const User = require('../models/user')
const models = require('../models/index');
const controller = {}
const jwt = require('jsonwebtoken')
const { Op } = require("sequelize");

// buat request dokumen yang ingin ditandangani
controller.buatRequest = async(req,res) =>{    
    const accessToken = req.cookies.accessToken 
     if (!accessToken)
        return res.status(200).json("tidak ada token")
     const payload = jwt.verify(accessToken, process.env.SECRET_TOKEN)
     const user = await User.findByPK(req.user_id)
     if(!user){
        return res.status(404).json({ error: 'User not found' })
     }
     let {user_id, document_id, nama_tujuan, jabatan, status, created_at, updated_at} = req.body
     try{   
         await signature.create({
             user_id      : user_id,
             document_id    : document_id,
             nama_tujuan: nama_tujuan,
             jabatan: jabatan,
             status: status,
             created_at: created_at,
             updated_at: updated_at
         })
         return res.json({
             pesan: "berhasil upload data"
         })
     }catch(err){
         console.log(err)
     }
        
 }