const express = require('express')
const server = express.Router()
const controller = require('../controllers/index.js')

server.get('/dokumen', controller.doc.cekDokumen)
server.post('/create', controller.doc.buatDokumen)


module.exports = server