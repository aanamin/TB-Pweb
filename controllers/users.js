const models = require('../models/index')
const bcrypt = require('bcryptjs')
const user = require('../models/user')

const controllers = {}

controllers.getAllUser = async (req, res) => {
    const users = await models.user.findAll({})
    res.status(200).send(users)
}


controllers.register = async(req, res) => {
    const {username, email, password, confPassword } = req.body;
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

module.exports = controllers