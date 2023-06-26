// middleware untuk cek waktu Login

const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');

const SECRET_TOKEN = process.env.SECRET_TOKEN;
const verifyToken = (req, res, next) => {
    

    const token  = req.cookies.accessToken;
    if (token) {
        jwt.verify(token, SECRET_TOKEN, (err, user) => {
          if (err) {
            return res.sendStatus(403);
          }

          req.user = user;
          next();
        });
    } else {
      res.status(400).redirect('login')
      // return res.redirect('login')
      
    }
  };
   


module.exports = verifyToken