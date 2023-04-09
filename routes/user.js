const express = require('express')
const server = express.Router()
const controller = require('../controllers/index.js')

server.get('/dokumen', controller.doc.cekDokumen)

module.exports = server