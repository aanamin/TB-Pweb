// middleware untuk cek waktu Login
const dotenv = require('dotenv');
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
dotenv.config();
const SECRET_TOKEN = process.env.SECRET_TOKEN;
const verifyToken = (req, res, next) => {
    
    const token  = req.cookies.token;
    if (token) {
        jwt.verify(token, SECRET_TOKEN, (err, user) => {
          if (err) {
            return res.sendStatus(403);
          }

          req.user = user;
          next();
        });
    } else {
      res.status(400).json({
        msg: 'Login terlebih dahulu'
    })
      return res.redirect('login')
      res.sendStatus(401);
    }
  };
   


module.exports = verifyToken