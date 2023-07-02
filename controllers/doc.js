// const { now } = require('sequelize/types/utils');
const {
    or, where
} = require('sequelize');
const documents = require('../models/documents');
const user = require('../models/user')
const models = require('../models/index');
const controller = {}
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const {
    Op
} = require("sequelize");


//tampil page All dokumen
controller.tampilAllDokumen = async (req, res) => {
    try {
        const token = req.cookies.accessToken; // Mengambil token dari cookies
        const userId = req.user.id;
        if (!token) {
            // Jika token tidak ada, kembalikan pesan error atau arahkan ke halaman login
            return res.status(401).json({
                message: 'Anda tidak memiliki otorisasi untuk mengakses halaman ini.'
            });
            // Atau: res.redirect('/login'); untuk mengarahkan ke halaman login
        }

        const dokumen = await models.documents.findAll({
            where: {
                id_user: userId
            }
        }); // Ambil semua data dokumen dari database

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

        res.render('upresources', {
            user: userProfile
        });
    } catch (error) {
        console.log(error)
    }
}

//create dokumen
controller.buatDokumen = async (req, res) => {

    try {
        const userId = req.user.id
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                message: 'Tidak ada file yang diunggah'
            });
        }
        const {
            name,
            namaFile,
            description,

        } = req.body;
        const file = req.files.file;
        const fileExtension = file.name.split('.').pop();
        const fileName = `${namaFile}${userId}.${fileExtension}`;

        file.mv(`uploads/${fileName}`, async (err) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: 'Terjadi kesalahan saat mengunggah file'
                });
            }
            const countDocs = await documents.count();
            let docId = `doc${countDocs + 1}`;
            const idDoc = await models.documents.findOne({
                where: {
                    id: docId
                }
            })
            if(!idDoc){
                await documents.create({
                    id: docId,
                    id_user: userId,
                    name: name,
                    filename: fileName,
                    description: description
                });
            }
            let i = 2;
            while (idDoc) {
                let docId = `doc${countDocs + i}`;
                const dokumen = await models.documents.findOne({
                    where: {
                        id: docId
                    }
                });
                if (!dokumen) {
                    await documents.create({
                        id: docId,
                        id_user: userId,
                        name: name,
                        filename: fileName,
                        description: description
                    });
                    break;
                }
                i++;
            }





            res.redirect('resources')
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Failed to save file information'
        });
    }
}


// updatedokumen
controller.tampilEditDokumen = async (req, res) => {

    try {
        const userId = req.user.id
        const document_id = req.body.documents_id

        const dokumen = await models.documents.findOne({
            where: {
                id: document_id
            }
        })
        if (!dokumen) {
            return res.status(404).json({
                success: false,
                message: 'Tidak ada dokumen dengan id tersebut'
            })
        }
        const signature = await models.signature.findOne({
            where: {
                user_id: userId,
                document_id: document_id
            }
        })
        if(signature){
            const status = signature.status;
            if (status === 'accept') {
                return res.status(400).json({
                    message: 'maaf, dokumen ini sudah ditanda tangani'
                })
            }
            if (status === 'reject') {
                return res.status(400).json({
                    message: 'maaf, dokumen ini sudah ditolak'
                })
            }

        }
       
        res.render('editUpresources', {
            dokumen: dokumen
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            
        })
    }
}

controller.editDokumen = async (req, res) => {
    try {
        const userId = req.user.id
        const idDoc = req.body.document_id
        const dokumen = await models.documents.findOne({
            where: {
                id: idDoc
            }
        })
        const filePath = path.join(__dirname, '..', 'uploads', dokumen.filename);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Gagal menghapus file:', err);
            }
        });
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                message: 'Tidak ada file yang diunggah'
            });
        }
        const {
            name,
            namaFile,
            description,

        } = req.body;
        const file = req.files.file;
        const fileExtension = file.name.split('.').pop();
        const fileName = `${namaFile}${userId}.${fileExtension}`;

        file.mv(`uploads/${fileName}`, async (err) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: 'Terjadi kesalahan saat mengunggah file'
                });
            }
            const countDocs = await documents.count();
            let docId = `doc${countDocs + 1}`;
            const dokumenID = await models.documents.findOne({
                where: {
                    id: docId
                }
            })

            if (dokumenID) {
                docId = `doc${countDocs + 1}${name}`;

            }


            await models.documents.update({
                id: docId,
                name: name,
                filename: fileName,
                description: description
            },{where:{
                id:idDoc,
                id_user: userId,
            }}
            );



            res.redirect('resources')
        });

    } catch (error) {
        console.log(error)
    }
}

// deletedokumen
controller.deleteDokumen = async (req, res) => {

    try {
        const id = req.params.id;

        const dokumen = await documents.findOne({
            where: {
                id
            }
        });
        if (!dokumen) {
            return res.status(404).json({
                pesan: 'Dokumen tidak ditemukan.'
            });
        }

        const filePath = path.join(__dirname, '..', 'uploads', dokumen.filename);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Gagal menghapus file:', err);
            }
        });
        // Proses penghapusan dokumen berdasarkan ID yang diterima
        await documents.destroy({
            where: {
                id
            }
        });
        
        res.redirect('/resources');


        return res.json({
            pesan: "berhasil menghapus data"
        })
    } catch (err) {
        console.log(err)
    }
}
// view dokumen
controller.detailDokumen = async (req, res) => {
    const {
        filename
    } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);

    res.sendFile(filePath);
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