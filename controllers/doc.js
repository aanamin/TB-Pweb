// const { now } = require('sequelize/types/utils');
const { or } = require('sequelize');
const documents = require('../models/documents');
const models = require('../models/index');
const controller = {}
const jwt = require('jsonwebtoken')
const { Op } = require("sequelize");

//read dokumen
controller.cekDokumen = async(req,res) =>{
    const accessToken = req.cookies.accessToken 
     if (!accessToken)
        return res.status(200).json("tidak ada token")
     const payload = jwt.verify(accessToken, process.env.SECRET_TOKEN)
    const dokumen = await documents.findAll()
    res.json(dokumen)
    if(!dokumen)
        return res.status(200).json("Tidak dapat ditemukan")
    // next()
    
}

//create dokumen
controller.buatDokumen = async(req,res) =>{    
   const accessToken = req.cookies.accessToken 
    if (!accessToken)
       return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.SECRET_TOKEN)
    let id= req.body.id;
    let name = req.body.name;
    let filename =  req.body.filename;
    let description = req.body.description;
    let created_at = req.body.created_at;
    let updated_at = req.body.updated_at;
    try{    
        await documents.create({
            id      : id,
            name    : name,
            filename: filename,
            description: description,
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

// updatedokumen
    controller.editDokumen = async(req, res)=>{
        let id= req.body.id;
        let name = req.body.name;
        let filename =  req.body.filename;
        let description = req.body.description;
        let created_at = req.body.created_at;
        let updated_at = req.body.updated_at;
        
        try{    
            await documents.update({
                id      : id,
                name    : name,
                filename: filename,
                description: description,
                created_at: created_at,
                updated_at: updated_at
            },{
                where : {id : id}
            })
            return res.json({
                pesan: "berhasil update data"
            })
        }catch(err){
            console.log(err)
        }
    }
    
    // deletedokumen
    controller.deleteDokumen = async(req,res)=>{
        let id= req.body.id;
        let name = req.body.name;
        let filename =  req.body.filename;
        let description = req.body.description;
        let created_at = req.body.created_at;
        let updated_at = req.body.updated_at;

        try{    
            await documents.destroy({
                
                where: {
                    [Op.or]: [
                     {id: {
                         [Op.substring]: id}
                     }, {name: {
                        [Op.substring]: name}
                    }, {filename: {
                        [Op.substring]: filename}
                    }, {description: {
                        [Op.substring]: description}
                    }
                ]
                 }
            })
            return res.json({
                pesan: "berhasil menghapus data"
            })
        }catch(err){
            console.log(err)
        }
    }

    // mencari dokumen
    controller.findDokumen = async(req,res)=>{
        let id= req.body.id;
        let name = req.body.name;
        let filename =  req.body.filename;
        let description = req.body.description;

        try{
            const dokumen = await documents.findAll({
                where: {
                    [Op.or]: [
                     {id: {
                         [Op.substring]: id}
                     }, {name: {
                        [Op.substring]: name}
                    }, {filename: {
                        [Op.substring]: filename}
                    }, {description: {
                        [Op.substring]: description}
                    }
                ]
                 }
            })
            return res.status(200).json(
                dokumen
            )
        }
        catch(err){

        }
    }
    
module.exports = controller