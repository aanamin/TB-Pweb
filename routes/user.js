const express = require('express')
const server = express.Router()
const controller = require('../controllers/index.js')
const login = require('../middleware/login.js')

server.get('/dokumen', login, controller.doc.cekDokumen)
server.post('/create', login, controller.doc.buatDokumen)
server.post('/update', controller.doc.editDokumen)
server.post('/delete', controller.doc.deleteDokumen)
server.post('/find', controller.doc.findDokumen)

server.post('/register', controller.user.register)
server.post('/login', controller.user.login)

module.exports = server