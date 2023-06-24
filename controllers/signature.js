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
const fs = require('fs');
const {
  PDFDocument
} = require('pdf-lib');

// buat request dokumen yang ingin ditandangani

controllers.myrequest = async (req, res) => {

  try {
    const userId = req.user.id
    const ttd = await models.signature.findAll({
      include: [{
          model: models.documents,
          attribute: ['filename'],
        },
        {
          model: models.user,
          as: 'Receiver',
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

    const ttd = await models.signature.findAll({
      include: [{
          model: models.documents,
          attribute: ['filename'],
        },
        {
          model: models.user,
          as: 'Sender',
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
      where: {
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
      where: {
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
    if (!tujuan) {
      return res.status(404).json({
        message: 'maaf email tidak ditemukan'
      })
    }

    const ttd = await models.signature.create({
      user_id: userId,
      id_tujuan: tujuan.id,
      document_id: dokumen,
      jabatan: jabatan,
      status: status,
    })


    res.status(200).json({
      msg: 'Data Berhasil Ditambahkan',
      ttd: ttd,
      success: true
    });
  } catch (error) {
    res.status(400).json({
      msg: 'terdapat Eror'
    })
    console.log(error)
  }
}

controllers.deleteMyrequest = async (req, res) => {
  try {
    const userId = req.user.id

    await models.signature.destroy({
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

controllers.tampileditMyrequest = async (req,res) =>{
  try {
    // const userId = req.user.id
    const document_id = req.body.document_id

    const signature = await models.signature.findOne({
      where: { 
        document_id: document_id
      }
    })
    res.render('editRequestsend', {
      signature: signature
    })
  } catch (error) {
    console.log(error)
  }
}

controllers.decisionRequest = async (req, res) => {
  try {

    const idLogin = req.user.id
    const {
      decision,
      user_id,
      document_id
    } = req.body;

    // Melakukan pembaruan status pada data signature berdasarkan user_id dan document_id
    if (decision === 'accept') {
      const doc = await models.documents.findOne({
        where: {
          id: document_id
        }
      })

      const pdfPath = path.join(__dirname, '..', 'uploads', doc.filename);
      const imagePath = path.join(__dirname, '..', 'uploads', `${idLogin}.png`);

      const pdfBytes = fs.readFileSync(pdfPath);
      const imageBytes = fs.readFileSync(imagePath);

      const pdfDoc = await PDFDocument.load(pdfBytes);
      const image = await pdfDoc.embedPng(imageBytes);
      const scaleFactor = 0.5;
      const newWidth = image.width * scaleFactor;
      const newHeight = image.height * scaleFactor;

      const imagePage = pdfDoc.addPage();

      imagePage.drawImage(image, {
        x: 0,
        y: 0,
        width: newWidth,
        height: newHeight,
      });
      const uploadFolderPath = path.join(__dirname, '..', 'uploads');
      const filePath = path.join(__dirname, '..', 'uploads', doc.filename);

          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Gagal menghapus file:', err);
            }
          });
      const newFilePath = path.join(uploadFolderPath, `${doc.filename}`);

      const pdfBytesWithImage = await pdfDoc.save();
      await fs.promises.writeFile(newFilePath, pdfBytesWithImage);
    }
    await models.signature.update({
      status: decision
    }, {
      where: {
        user_id,
        document_id
      }
    });


    res.status(200).json({
      msg: 'Data Berhasil Ditambahkan',
      decision: decision,
      user_id: user_id,
      document_id: document_id,
      success: true
    });
  } catch (error) {
    res.status(400).json({
      msg: 'terdapat Eror'
    })
    console.log(error)
  }
}

module.exports = controllers