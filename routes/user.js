const express = require('express')
const server = express.Router()
const controller = require('../controllers/index.js')
const login = require('../middleware/login.js')
const upload = require('../middleware/upload.js')
const verifyToken = require('../middleware/login.js')

server.get('/dokumen', verifyToken, controller.doc.cekDokumen)
server.post('/upload', upload.single('pdfFile'), controller.doc.buatDokumen)

server.post('/editResources', verifyToken, controller.doc.tampilEditDokumen)
server.post('/editSources', verifyToken, controller.doc.editDokumen)
server.post('/deleteDocuments/:id', verifyToken, controller.doc.deleteDokumen)
server.get('/detailDocuments/:filename', verifyToken, controller.doc.detailDokumen)
server.get('/detailDocuments/:document_id', verifyToken, controller.doc.detailDokumen)
server.post('/find', verifyToken,controller.doc.findDokumen)
server.get('/resources',verifyToken, controller.doc.tampilAllDokumen)
server.get('/upresources',verifyToken, controller.doc.tampilBuatDokumen)
server.post('/upresources',verifyToken, controller.doc.buatDokumen)

server.get('/landing',  controller.user.landing)
server.post('/signup', controller.user.register)
server.get('/signup', controller.user.tampilRegister)
server.post('/login', controller.user.login)
server.get('/login', controller.user.tampilLogin)
server.get('/profile', verifyToken, controller.user.profil)
server.get('/mainpage', verifyToken, controller.user.mainpage)
server.get('/upSignature', verifyToken ,controller.user.tampilUpsignature)
server.post('/upSignature', verifyToken,  controller.user.upsignature)
server.get('/logout',verifyToken,   controller.user.logout) 

server.get('/myrequest', verifyToken, controller.signature.myrequest)
server.get('/requestsign', verifyToken, controller.signature.requestsign)
server.get('/requestsend', verifyToken, controller.signature.tampilrequestsend)
server.post('/requestsend', verifyToken, controller.signature.requestsend)
server.post('/deleteMyrequest', verifyToken, controller.signature.deleteMyrequest)
server.post('/makeDecision', verifyToken, controller.signature.decisionRequest)
server.post('/editMyrequest', verifyToken, controller.signature.tampileditMyrequest)
server.post('/ubahMyrequest', verifyToken, controller.signature.ubahMyRequest)
module.exports = server