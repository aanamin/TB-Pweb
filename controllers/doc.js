// const { now } = require('sequelize/types/utils');
const {
    or
} = require('sequelize');
const documents = require('../models/documents');
const models = require('../models/index');
const controller = {}
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const {
    Op
} = require("sequelize");


//tampil page All dokumen
controller.tampilAllDokumen = async (req, res) => {
    try {
        const token = req.cookies.token; // Mengambil token dari cookies

        if (!token) {
            // Jika token tidak ada, kembalikan pesan error atau arahkan ke halaman login
            return res.status(401).json({
                message: 'Anda tidak memiliki otorisasi untuk mengakses halaman ini.'
            });
            // Atau: res.redirect('/login'); untuk mengarahkan ke halaman login
        }

        const dokumen = await documents.findAll(); // Ambil semua data dokumen dari database

        if (!dokumen) {
            return res.status(200).json("Tidak dapat ditemukan");
        }

        res.render('resources', {
            dokumen
        }); // Kirim data dokumen ke halaman resources.ejs
    } catch (error) {
        res.status(500).send(error);
    }
};

//read dokumen
controller.cekDokumen = async (req, res) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.SECRET_TOKEN)

    const documents = await documents.findAll()
    res.render('resources', {
        documents
    });
    res.json(dokumen)
    if (!dokumen)
        return res.status(200).json("Tidak dapat ditemukan")
    // next()

}

//tampil buat dokumen
controller.tampilBuatDokumen = async (req, res) => {
    res.render('upresources')
}

//create dokumen
controller.buatDokumen = async (req, res) => {

    try {
        const userId = req.user.id
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'Tidak ada file yang diunggah' });
          }
        const {
            name,
            namaFile,
            description,

        } = req.body;
        const file = req.files.file;
        const fileExtension = file.name.split('.').pop();
        const fileName = `${namaFile}.${fileExtension}`;

        const countDocs = await documents.count();
        const docId = `doc${countDocs + 1}`;


        await documents.create({
            id: docId,
            id_user: userId,
            name: name,
            filename: fileName,
            description: description
        });

        // Respon jika berhasil
        return res.status(200).json({
            message: 'File uploaded successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Failed to save file information'
        });
    }
}



// controller upload file
// controller.storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, documents.name + path.extname(file.originalname))
//     }
// })

// updatedokumen
controller.editDokumen = async (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let filename = req.body.filename;
    let description = req.body.description;
    let created_at = req.body.created_at;
    let updated_at = req.body.updated_at;

    try {
        await documents.update({
            id: id,
            name: name,
            filename: filename,
            description: description,
            created_at: created_at,
            updated_at: updated_at
        }, {
            where: {
                id: id
            }
        })
        return res.json({
            pesan: "berhasil update data"
        })
    } catch (err) {
        console.log(err)
    }
}

// deletedokumen
controller.deleteDokumen = async (req, res) => {

    try {
        const id = req.params.id;
        // Proses penghapusan dokumen berdasarkan ID yang diterima
        await documents.destroy({
            where: {
                id
            }
        });
        // Ganti dengan logika penghapusan dokumen Anda
        res.redirect('/resources');


        return res.json({
            pesan: "berhasil menghapus data"
        })
    } catch (err) {
        console.log(err)
    }
}

// mencari dokumen
controller.findDokumen = async (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let filename = req.body.filename;
    let description = req.body.description;

    try {
        const dokumen = await documents.findAll({
            where: {
                [Op.or]: [{
                    id: {
                        [Op.substring]: id
                    }
                }, {
                    name: {
                        [Op.substring]: name
                    }
                }, {
                    filename: {
                        [Op.substring]: filename
                    }
                }, {
                    description: {
                        [Op.substring]: description
                    }
                }]
            }
        })
        return res.status(200).json(
            dokumen
        )
    } catch (err) {

    }
}

module.exports = controller