const express = require('express')
const server = express.Router()
const controller = require('../controllers/index.js')
const login = require('../middleware/login.js')
const upload = require('../middleware/upload.js')

server.get('/dokumen', login, controller.doc.cekDokumen)
server.post('/upload', upload.single('pdfFile'), controller.doc.buatDokumen)

server.post('/update', login, controller.doc.editDokumen)
server.post('/deleteDocuments/:id', login, controller.doc.deleteDokumen)
server.get('/detailDocuments/:filename', login, controller.doc.detailDokumen)
server.get('/detailDocuments/:document_id', login, controller.doc.detailDokumen)
server.post('/find', controller.doc.findDokumen)
server.get('/resources',login, controller.doc.tampilAllDokumen)
server.get('/upresources',login, controller.doc.tampilBuatDokumen)
server.post('/upresources',login, controller.doc.buatDokumen)

server.get('/landing',  controller.user.landing)
server.post('/signup', controller.user.register)
server.get('/signup', controller.user.tampilRegister)
server.post('/login', controller.user.login)
server.get('/login', controller.user.tampilLogin)
server.get('/profile', login, controller.user.profil)
server.get('/mainpage', login, controller.user.mainpage)
server.get('/upSignature', login ,controller.user.tampilUpsignature)
server.post('/upSignature', login,  controller.user.upsignature)
server.get('/logout',login,   controller.user.logout) 

server.get('/myrequest', login, controller.signature.myrequest)
server.get('/requestsign', login, controller.signature.requestsign)
server.get('/requestsend', login, controller.signature.tampilrequestsend)
server.post('/requestsend', login, controller.signature.requestsend)
server.post('/deleteMyrequest', login, controller.signature.deleteMyrequest)
server.post('/makeDecision', login, controller.signature.decisionRequest)
module.exports = server