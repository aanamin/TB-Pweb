const doc = require('./doc.js')
const user = require('./users.js')
const signature = require('./signature.js')

const controller = {}

controller.doc = doc
controller.user = user
controller.signature = signature

module.exports = controller