//database
const sequalize =  require('sequelize')
const db = new sequalize('siletra', 'root', '', {
    host    : "localhost",
    dialect : "mysql"
})

module.exports = db