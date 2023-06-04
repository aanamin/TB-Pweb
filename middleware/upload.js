const multer = require('multer');

// Konfigurasi penyimpanan file dengan multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Folder tujuan penyimpanan file
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix); // Nama file saat disimpan
  }
});

// Inisialisasi middleware multer
const upload = multer({ storage: storage });

module.exports = upload;