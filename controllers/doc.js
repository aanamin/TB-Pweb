// const { now } = require('sequelize/types/utils');
const documents = require('../models/documents');
const models = require('../models/index');
const controller = {}

controller.cekDokumen = async(req,res) =>{
    const dokumen = await documents.findAll()
    res.json(dokumen)
    if(dokumen)
    return res.status(200).json("Tidak dapat ditemukan")
    // next()
}

controller.buatDokumen = async(req,res,next) =>{
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

module.exports = controller