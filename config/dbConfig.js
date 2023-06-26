//database
const sequalize =  require('sequelize')
const db = new sequalize(`${process.env.DB_NAME}`, `${process.env.DB_USERNAME}`, `${process.env.DB_PASSWORD}`, {
    host    : `${process.env.DB_HOST}`,
    dialect : "mysql"
})

module.exports = db