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

module.exports = controller