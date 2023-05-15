const models = require('../models/index')
const bcrypt = require('bcryptjs')
const user = require('../models/user')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config();
process.env.SECRET_TOKEN;

const controllers = {}

function generateAccessToken(email){
    return jwt.sign(email, process.env.SECRET_TOKEN, { expiresIn: '60000S' });
}


controllers.getAllUser = async (req, res) => {
    const users = await models.user.findAll({})
    res.status(200).send(users)
}


controllers.register = async(req, res) => {
    const {username, email, password } = req.body;
    // const salt = await bcrypt.genSalt();
    // const hashPassword = await bcrypt.hash(password, 10);
    let active= req.body.active;
    let sign_img=req.body.sign_img;
    let id = req.body.id;
    try {
        await user.create({
            id: id,
            username: username,
            email: email,
            password: password,
            sign_img: sign_img,
            active:active
        });
        res.json({msg: "Register Berhasil"});
    } catch (error) {
        console.log(error);
    }
}

controllers.register = async(req, res) => {
    const {username, email, password } = req.body;
    // const salt = await bcrypt.genSalt();
    // const hashPassword = await bcrypt.hash(password, 10);
    let active= req.body.active;
    let sign_img=req.body.sign_img;
    let id = req.body.id;
    try {
        await user.create({
            id: id,
            username: username,
            email: email,
            password: password,
            sign_img: sign_img,
            active:active
        });
        res.json({msg: "Register Berhasil"});
    } catch (error) {
        console.log(error);
    }
}


controllers.login = async(req,res)=>{
   try {
        const{email, password} = req.body
        const pengguna = await user.findOne({where: { email:req.body.email}});
        // pengguna.password = password
        if(!pengguna){
            return res.status(400).json({
                message: 'Invalid'
            });
        }
        
        if(password != pengguna.password){    
            return res.status(200).json({
                message: 'Password Anda Salah'
            });
        }
       
        const id = pengguna.id
        // const email = pengguna.email
        const username = pengguna.username
        const active = pengguna.active
        const sign_img = pengguna.sign_img

        const token = generateAccessToken({email: req.body.email})

        // const token = generateAccessToken({
        // id,email,password,username,active,sign_img}, process.env.SECRET_TOKEN);

        // await user.update(
        //     { remember_token: token },
        //     {
        //       where: { email: req.body.email },
        //     }
        //   );

        //   res.cookie("token", token, {
        //     httpOnly: true,
        //     maxAge: 24 * 60 * 60 * 1000,
        //   })
        res.status(200).json({token});
   } catch (error) {
    console.log(error);
    }
}


module.exports = controllers