const express = require('express')
const server = express.Router()
const controller = require('../controllers/index.js')

server.get('/dokumen', controller.doc.cekDokumen)
server.post('/create', controller.doc.buatDokumen)
// server.post('/edit', controller.doc.editDokumen)

server.post('/register', controller.user.register)
server.post('/login', controller.user.login)

module.exports = server