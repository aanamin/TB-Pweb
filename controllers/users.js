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
    // if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    let active= req.body.active;
    let sign_img=req.body.sign_img;
    let id = req.body.id;
    try {
        await user.create({
            id: id,
            username: username,
            email: email,
            password: hashPassword,
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
        // const{email, password} = req.body
        const pengguna = await user.findOne({where: { email:req.body.email}});
        // pengguna.password = password
        if(!pengguna){
            return res.status(400).json({
                message: 'Invalid'
            });
        }

        const isMatch = await  bcrypt.compareSync(req.body.password, pengguna.password);

        if(!isMatch){
            return res.status(400).json({
                message: 'Invalid password'
            });
        }
       
        const token = jwt.sign({id: user.id}, 'your_secret_key')
        res.status(200).json({token});
   } catch (error) {
    console.log(error);
    }
}


module.exports = controllers