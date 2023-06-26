const models = require('../models/index')
const bcrypt = require('bcryptjs')
const user = require('../models/user')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const fs = require('fs')
const {
    v4: uuidv4
} = require('uuid');

dotenv.config();
process.env.SECRET_TOKEN;

const controllers = {}

controllers.tampilChangepw = async (req, res) => {
    res.render('changepw')
}
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
        await models.user.update({
            active: 0,
        },{
            where:{
                id:userId
            }
        })
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    success: false,
                    msg: 'Cant logout',
                });
            }

            res.clearCookie('accessToken');
            
            res.render('login')
        });
    } catch (error) {
        console.log(error)
    }

}

controllers.tampilUpsignature = async (req, res) => {

    try {

        const userId = req.user.id
        const userProfile = await user.findOne({
            where: {
                id: userId
            }
        })
        if (!userProfile) {
            return res.status(404).json({
                message: 'Profil pengguna tidak ditemukan.'
            });
        }
        res.render('upsignature', {
            user: userProfile
        });
    } catch (error) {
        console.log(error)
    }

}

controllers.upsignature = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await models.user.findOne({
            where: {
                id: userId
            }
        });


        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                message: 'Tidak ada file yang diunggah'
            });
        }

        const file = req.files.file;
        const fileExtension = file.name.split('.').pop();
        const fileName = `${userId}.${fileExtension}`;

        // Simpan file ke direktori yang diinginkan
        file.mv(`uploads/${fileName}`, async (err) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: 'Terjadi kesalahan saat mengunggah file'
                });
            }

            // Simpan informasi file ke database
            const uploadedFile = await models.user.update({
                sign_img: fileName
            }, {
                where: {
                    id: userId
                }
            });

            return res.status(200).json({
                message: 'File berhasil diunggah',
                file: uploadedFile,
                success: true
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Terjadi kesalahan saat mengunggah file'
        });
    }
};

controllers.changepw = async (req, res) => {
    try {
        const {password, newpassword }= req.body
        const userId = req.user.id
        const user = await models.user.findOne({
            where:{
                id: userId
            }
        })
        if(password != user.password){
            return res.status(403).json({
                message: 'masukkan password yang benar'
            })
        } 
        await models.user.update({
            password: newpassword,
        },{
            where:{
                id:userId
            }
        })
        return res.status(201).json({
            msg:"Password anda telah diperbarui",
        })
    } catch (error) {
        console.log(error)
    }

}

controllers.profil = async (req, res) => {
    // res.render('profile')
    try {

        const userId = req.user.id
        const userProfile = await user.findOne({
            where: {
                id: userId
            }
        })
        if (!userProfile) {
            return res.status(404).json({
                message: 'Profil pengguna tidak ditemukan.'
            });
        }

        res.render('profile', {
            user: userProfile
        });
    } catch (error) {
        console.log(error)
    }
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

function generateAccessToken(email) {
    return jwt.sign(email, process.env.SECRET_TOKEN, {
        expiresIn: '6000S'
    });
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
        if (!req.session.user) {
            req.session.user = {};
        }
        await models.user.update({
            active: 1,
        },{
            where:{
                id:id
            }
        })
        req.session.user.id = id;
        const token = generateAccessToken({
            id,
            email
        }, process.env.SECRET_TOKEN);
        // const token = generateAccessToken({email: req.body.email})

        
        res.cookie("accessToken", token, {
            httpOnly: true,
            maxAge: 100 * 60 * 1000,
        })
        res.status(200).json({
            token: token,
            msg: 'Login Berhasil',
            success: true
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: 'Login Tidak Berhasil'
        })
        return res.render('login')
    }
}


module.exports = controllers