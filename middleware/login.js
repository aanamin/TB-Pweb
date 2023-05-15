// middleware untuk cek waktu Login
const dotenv = require('dotenv');
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
dotenv.config();

// function authenticateToken(req,res,next){
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]

//     if (token == null) return res.sendStatus(401)

//     jwt.verify(token, process.env.SECRET_TOKEN as String, (err, user)=>{

//     })
// }
const verifyToken = (req, res, next) => {
    try {
    const accessToken = req.headers.authorization.split(' ')[1];
    // jwt.verify(token)
    if (!accessToken)
        res.json({message:'token salah'})
    const payload = jwt.verify(accessToken, process.env.SECRET_TOKEN)
    // const id = payload.id
    // const nama = payload.nama
    // const NIP = payload.NIP
    next()
    } catch (err) {
        console.log(err)
    }
}

module.exports = verifyToken