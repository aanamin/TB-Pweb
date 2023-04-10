const db = require('../config/dbConfig.js')
const user = require('./user.js')
const documents = require('./documents.js')
const signature = require('./signature.js')


const models = {}
models.user = user
models.documents = documents
models.signature = signature


// db.sequelize.sync({ force: false})
// .then (() => {
//     console.log('yes re-sync done!')
// })

module.exports = db
