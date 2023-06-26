const {
  or,
  where
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

controllers.tampileditMyrequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const documentId = req.body.document_id;
    const signature = await models.signature.findOne({
      include: [{
        model: models.user,
        as: 'Receiver',
        attribute: ['email'],
      }],
      where: {
        document_id: documentId,
        user_id: userId
      }
    });

    if (!signature) {
      return res.status(404).json({
        success: false,
        message: 'Tidak ada tanda tangan dengan ID tersebut'
      });
    }

    const status = signature.status;
    if (status === 'accept' || status === 'reject') {
      return res.status(404).json({
        success: false,
        message: 'Maaf, dokumen ini sudah ditandatangani'
      });
    }

    const doc = await models.documents.findAll({
      where: {
        id_user: userId
      }
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Tidak ada dokumen dengan ID tersebut'
      });
    }

    res.render('editRequestsend', {
      signature: signature,
      dokumen: doc
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};



//edit myrequest
controllers.ubahMyRequest = async (req, res) => {
  try {
    const {
      user_id,
      document_id,
      email,
      jabatan,
      dokumen
    } = req.body;
    const user = await models.user.findOne({
      where: {
        email: email
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'email tersebut tidak terdaftar'
      })
    }

    const newSignature = await models.signature.update({

      id_tujuan: user.id,
      jabatan: jabatan,
      document_id: dokumen
    }, {
      where: {
        user_id: user_id,
        document_id: document_id
      }
    })

    res.status(200).json({
      msg: 'Data Berhasil Ditambahkan',
      dataBaru: newSignature,
      success: true
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: 'terdapat Eror'
    })
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

      const pdfDoc = await PDFDocument.load(pdfBytes, {
        ignoreEncryption: true
      });
      const image = await pdfDoc.embedPng(imageBytes);
      const scaleFactor = 0.5;
      const newWidth = image.width * scaleFactor;
      const newHeight = image.height * scaleFactor;

      const lastPage = pdfDoc.getPage(pdfDoc.getPageCount() - 1);
      // const { width, height } = lastPage.getSize();

      lastPage.drawImage(image, {
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

      const currentTime = new Date()
      // console.log(currentTime)
      await models.signature.update({
        signed_at: currentTime
      }, {
        where: {
          user_id,
          document_id
        }
      });
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