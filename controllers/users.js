const models = require('../models/index')
const bcrypt = require('bcryptjs')
const user = require('../models/user')
const jwt = require('jsonwebtoken')


const controllers = {}

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

        // const salt = await bcrypt.genSalt();
        // const hashPassword = await bcrypt.hash(req.body.password, 10);
        const uspass = pengguna.password  
        const ispass = password  
        const isMatch = await  bcrypt.compareSync(password, pengguna.password);
        // res.status(200).json({ispass:ispass, uspass:uspass});
        if(password != pengguna.password){    
            return res.status(200).json({
                message: 'Password Anda Salah'
            });
        }
       
        const token = jwt.sign({id: user.id}, 'SECRET_TOKEN')
        res.status(200).json({token});
   } catch (error) {
    console.log(error);
    }
}


module.exports = controllers