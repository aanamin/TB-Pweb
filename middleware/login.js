//middleware untuk cek waktu Login

const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    try {
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        res.render("loginUser")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id = payload.id
    const nama = payload.nama
    next()
    } catch (err) {
        res.render("mainlogin")
    }
}

module.exports = verifyToken 