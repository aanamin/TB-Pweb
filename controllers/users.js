const models = require('../models/index')
const bcrypt = require('bcryptjs')
const user = require('../models/user')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

dotenv.config();
process.env.SECRET_TOKEN;

const controllers = {}

controllers.tampilLogin = async (req, res) => {
    res.render('login')
}
controllers.tampilRegister = async (req, res) => {
    res.render('signup')
}

controllers.mainpage = async (req, res) => {
    
    res.render('mainpage')
}

controllers.landing = async (req, res) => {
    res.render('landingpage')
}

controllers.logout = async (req, res) => {
    try {
        
        const userId = req.user.id
        const userProfile = await user.findOne({where: {
            id: userId
        }})
        if (!userProfile) {
          return res.status(404).json({ message: 'Profil pengguna tidak ditemukan.' });
        }
        delete req.session.userId;
        res.render('login');
      } catch (error) {
        console.log(error)
      }
    
}

controllers.tampilUpsignature = async (req,res) => {
    
    try {
        
        const userId = req.user.id
        const userProfile = await user.findOne({where: {
            id: userId
        }})
        if (!userProfile) {
          return res.status(404).json({ message: 'Profil pengguna tidak ditemukan.' });
        }
    
        res.render('upsignature', {
            user: userProfile
        });
      } catch (error) {
        console.log(error)
      }
    
}

controllers.upsignature = async (req,res) => {
    try {
        const userId = req.user.id
        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).json({ message: 'Tidak ada file yang diunggah' });
        }
        const file = req.files.file;
        const fileExtension = file.name.split('.').pop();
        const fileName = `${userId}.${fileExtension}`;
    
        // Simpan file ke direktori yang diinginkan
        file.mv(`uploads/${fileName}`, async (err) => {
          if (err) {
            console.log(err)
            return res.status(500).json({ message: 'Terjadi kesalahan saat mengunggah file' });
          }
    
          // Simpan informasi file ke database
          const uploadedFile = await user.update({
            sign_img: fileName
          }, {
            where: {
                id: userId
            }
          });
    
          return res.status(200).json({ message: 'File berhasil diunggah', file: uploadedFile, success: true });
        });
      } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Terjadi kesalahan saat mengunggah file' });
      }
    };

controllers.profil = async (req, res) => {
    // res.render('profile')
    try {
        
        const userId = req.user.id
        const userProfile = await user.findOne({where: {
            id: userId
        }})
        if (!userProfile) {
          return res.status(404).json({ message: 'Profil pengguna tidak ditemukan.' });
        }
    
        res.render('profile', {
            user: userProfile                           
        });
      } catch (error) {
        console.log(error)
      }
}

function generateAccessToken(email) {
    return jwt.sign(email, process.env.SECRET_TOKEN, {
        expiresIn: '6000S'
    });
}


controllers.getAllUser = async (req, res) => {
    const users = await models.user.findAll({})
    res.status(200).send(users)
}


controllers.register = async (req, res) => {
    try {
        const {
            username,
            email,
            password
        } = req.body;
        // const salt = await bcrypt.genSalt();
        // const hashPassword = await bcrypt.hash(password, 10);
        let active = req.body.active;
        let sign_img = req.body.sign_img;
        let id = req.body.id;

        const existingUser = await user.findOne({
            where: {
                email
            }
        });
        if (existingUser) {
            return res.status(400).json({
                msg: 'Email Sudah Terdaftar'
            });
        }

        const countUsers = await user.count();

        // Membuat ID otomatis dengan format "user+number"
        const userId = `user${countUsers + 1}`;
        await user.create({
            id: userId,
            username: username,
            email: email,
            password: password
        });
        res.json({
            msg: "Register Berhasil"
        });
    } catch (error) {
        console.log(error);
    }
}


controllers.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        const pengguna = await user.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!pengguna) {
            
            return res.status(400).json({
                message: 'Invalid'
            });
        }

        if (password != pengguna.password) {
           
            return res.status(400).json({
                message: 'Password Anda Salah'
            });

        }

        const id = pengguna.id

        // const token = generateAccessToken({email: req.body.email})

        const token = generateAccessToken({
            id,
            email
        }, process.env.SECRET_TOKEN);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 100*60 * 1000,
        })
        res.status(200).json({
            token: token,
            msg: 'Login Berhasil',
            success: true
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Login Tidak Berhasil'
        })
        return res.render('login')
    }
}


module.exports = controllers